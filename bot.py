import asyncio
import logging
import sqlite3
import datetime
import os
from aiogram import Bot, Dispatcher, F
from aiogram.types import Message, CallbackQuery, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.filters import CommandStart, Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.fsm.storage.memory import MemoryStorage

# --- КОНФИГУРАЦИЯ ---
BOT_TOKEN = os.getenv("BOT_TOKEN", "7976913444:AAE7ZBw_c9c0B0JjqYqYRNqZaCuMTrzORS4")
OWNER_ID = int(os.getenv("OWNER_ID", "8165620138"))

# --- БАЗА ДАННЫХ ---
conn = sqlite3.connect("nen_data.db")
cursor = conn.cursor()

# Создаем таблицы, если их нет
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY,
    username TEXT,
    rank TEXT DEFAULT '#01'
)
""")
cursor.execute("""
CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT
)
""")
conn.commit()

# --- ЛОГИКА РАНГОВ ---
def get_rank(user_id):
    if user_id == OWNER_ID:
        return "#02"
    cursor.execute("SELECT rank FROM users WHERE user_id = ?", (user_id,))
    result = cursor.fetchone()
    return result[0] if result else "#01"

def add_user(user_id, username):
    cursor.execute("INSERT OR IGNORE INTO users (user_id, username) VALUES (?, ?)", (user_id, username))
    conn.commit()

def get_all_admins():
    cursor.execute("SELECT user_id FROM users WHERE rank = '#02'")
    admins = [row[0] for row in cursor.fetchall()]
    if OWNER_ID not in admins:
        admins.append(OWNER_ID)
    return admins

# --- FSM (СОСТОЯНИЯ) ---
class TicketState(StatesGroup):
    waiting_for_category = State()
    waiting_for_text = State()

class AdminState(StatesGroup):
    waiting_for_reply = State()
    waiting_for_rejection_reason = State()
    waiting_for_event_text = State()

# --- ИНИЦИАЛИЗАЦИЯ ---
bot = Bot(token=BOT_TOKEN)
dp = Dispatcher(storage=MemoryStorage())
logging.basicConfig(level=logging.INFO)

# --- КЛАВИАТУРЫ ---
def kb_main_menu(rank):
    buttons = [
        [InlineKeyboardButton(text="⧉ СОЗДАТЬ ЗАПРОС", callback_data="ticket_start")],
        [InlineKeyboardButton(text="⌬ ИВЕНТЫ", callback_data="show_events")],
        [InlineKeyboardButton(text="◈ ПРОФИЛЬ", callback_data="profile")]
    ]
    if rank == "#02":
        buttons.append([InlineKeyboardButton(text="⚙️ АДМИН ПАНЕЛЬ", callback_data="admin_panel")])
    return InlineKeyboardMarkup(inline_keyboard=buttons)

def kb_cancel():
    return InlineKeyboardMarkup(inline_keyboard=[[InlineKeyboardButton(text="[ ОТМЕНА ]", callback_data="cancel_action")]])

def kb_ticket_categories():
    categories = ["Вопрос", "Лаг", "Баг", "Запрос", "Предложение"]
    buttons = []
    for cat in categories:
        buttons.append([InlineKeyboardButton(text=f"⧉ {cat}", callback_data=f"cat_{cat}")])
    buttons.append([InlineKeyboardButton(text="[ НАЗАД ]", callback_data="menu_main")])
    return InlineKeyboardMarkup(inline_keyboard=buttons)

def kb_admin_actions(user_id, category, user_question_snippet):
    # user_question_snippet обрезаем, чтобы влезло в callback (макс 64 байта)
    short_snippet = user_question_snippet[:10] 
    return InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(text="Ответить", callback_data=f"adm_reply_{user_id}"),
            InlineKeyboardButton(text="Отклонить", callback_data=f"adm_reject_{user_id}_{category}")
        ]
    ])

def kb_admin_panel():
    return InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="[+] ДОБАВИТЬ ИВЕНТ", callback_data="adm_add_event")],
        [InlineKeyboardButton(text="[-] УДАЛИТЬ ИВЕНТ", callback_data="adm_del_event_list")],
        [InlineKeyboardButton(text="[ НАЗАД ]", callback_data="menu_main")]
    ])

# --- ХЕНДЛЕРЫ: START И МЕНЮ ---

@dp.message(CommandStart())
async def cmd_start(message: Message, state: FSMContext):
    await state.clear()
    add_user(message.from_user.id, message.from_user.username)
    rank = get_rank(message.from_user.id)
    
    text = (
        f"⧉ **NΞN SYSTEM v2.0**\n"
        f"Пользователь: {message.from_user.first_name}\n"
        f"Статус доступа: {rank}\n\n"
        "Система готова к работе. Выберите модуль:"
    )
    await message.answer(text, reply_markup=kb_main_menu(rank), parse_mode="Markdown")

@dp.callback_query(F.data == "menu_main")
async def cb_menu_main(callback: CallbackQuery, state: FSMContext):
    await state.clear()
    rank = get_rank(callback.from_user.id)
    await callback.message.edit_text("⧉ **ГЛАВНОЕ МЕНЮ**", reply_markup=kb_main_menu(rank), parse_mode="Markdown")

@dp.callback_query(F.data == "profile")
async def cb_profile(callback: CallbackQuery):
    rank = get_rank(callback.from_user.id)
    text = (
        f"👤 **ЛИЧНОЕ ДЕЛО**\n\n"
        f"ID: `{callback.from_user.id}`\n"
        f"Rank: **{rank}**\n"
        f"Дата регистрации: {datetime.date.today()}"
    )
    await callback.message.edit_text(text, reply_markup=InlineKeyboardMarkup(inline_keyboard=[[InlineKeyboardButton(text="[ НАЗАД ]", callback_data="menu_main")]]), parse_mode="Markdown")

@dp.callback_query(F.data == "cancel_action")
async def cb_cancel(callback: CallbackQuery, state: FSMContext):
    await state.clear()
    await callback.message.edit_text("⧉ Операция отменена.", reply_markup=InlineKeyboardMarkup(inline_keyboard=[[InlineKeyboardButton(text="[ В МЕНЮ ]", callback_data="menu_main")]]))

# --- ХЕНДЛЕРЫ: СОЗДАНИЕ ТИКЕТА (USER #01) ---

@dp.callback_query(F.data == "ticket_start")
async def cb_ticket_start(callback: CallbackQuery, state: FSMContext):
    await callback.message.edit_text("Выберите категорию запроса:", reply_markup=kb_ticket_categories())
    await state.set_state(TicketState.waiting_for_category)

@dp.callback_query(TicketState.waiting_for_category, F.data.startswith("cat_"))
async def cb_ticket_cat(callback: CallbackQuery, state: FSMContext):
    category = callback.data.split("_")[1]
    await state.update_data(category=category)
    await callback.message.edit_text(
        f"Категория: **{category}**\n\nОпишите вашу проблему или предложение одним сообщением:", 
        reply_markup=kb_cancel(), 
        parse_mode="Markdown"
    )
    await state.set_state(TicketState.waiting_for_text)

@dp.message(TicketState.waiting_for_text)
async def process_ticket_text(message: Message, state: FSMContext):
    data = await state.get_data()
    category = data.get("category")
    user_text = message.text
    user_id = message.from_user.id
    username = message.from_user.username
    
    # Сохраняем текст пользователя во временное хранилище (в state админа мы его передать не сможем напрямую через кнопку, но он будет в тексте сообщения)
    
    # Отправка админам
    admins = get_all_admins()
    
    admin_text = (
        f"📨 **НОВЫЙ ТИКЕТ**\n"
        f"От: @{username} (Rank #01)\n"
        f"Категория: {category}\n"
        f"ID: `{user_id}`\n\n"
        f"Сообщение:\n__{user_text}__"
    )
    
    for admin_id in admins:
        try:
            # Сохраняем сниппет текста для контекста (первые 20 символов)
            await bot.send_message(
                admin_id, 
                admin_text, 
                reply_markup=kb_admin_actions(user_id, category, user_text), 
                parse_mode="Markdown"
            )
        except:
            pass # Админ заблокировал бота

    await message.answer("⧉ **Система:** Ваш запрос отправлен операторам. Ожидайте ответа.", reply_markup=kb_main_menu(get_rank(user_id)), parse_mode="Markdown")
    await state.clear()

# --- ХЕНДЛЕРЫ: АДМИН ОТВЕТ ИЛИ ОТКЛОНЕНИЕ (ADMIN #02) ---

# 1. ОТКЛОНЕНИЕ
@dp.callback_query(F.data.startswith("adm_reject_"))
async def cb_adm_reject(callback: CallbackQuery, state: FSMContext):
    # data format: adm_reject_{user_id}_{category}
    _, _, target_user_id, category = callback.data.split("_")
    
    # Нам нужно достать текст сообщения пользователя. Так как он был в сообщении бота, вытащим его из текста сообщения callback'а
    original_msg_lines = callback.message.text.split("\n")
    # Ищем строку с сообщением (она последняя после __)
    # Это упрощенный вариант. В идеале хранить в БД, но для примера парсим текст
    
    await state.update_data(target_user_id=target_user_id, category=category, msg_id_to_edit=callback.message.message_id)
    
    await callback.message.edit_text(
        f"⚠️ **РЕЖИМ ОТКЛОНЕНИЯ**\nПолучатель ID: {target_user_id}\n\nУкажите причину отклонения:",
        reply_markup=kb_cancel(),
        parse_mode="Markdown"
    )
    await state.set_state(AdminState.waiting_for_rejection_reason)

@dp.message(AdminState.waiting_for_rejection_reason)
async def process_rejection(message: Message, state: FSMContext):
    data = await state.get_data()
    target_user_id = int(data.get("target_user_id"))
    category = data.get("category")
    reason = message.text
    admin_name = message.from_user.first_name
    
    current_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")

    # Формируем сообщение по шаблону
    rejection_msg = (
        f"⧉ **СИСТЕМНОЕ УВЕДОМЛЕНИЕ**\n\n"
        f"[{current_date}] - Вы написали админу: \":{category}:\"\n\n"
        f"Админ **{admin_name}** отклонил ваш **{category}** по причине:\n"
        f"⚠️ **{reason}**"
    )

    try:
        await bot.send_message(target_user_id, rejection_msg, parse_mode="Markdown")
        await message.answer("✅ Отказ отправлен пользователю.", reply_markup=kb_main_menu("#02"))
    except:
        await message.answer("❌ Не удалось отправить (Пользователь заблокировал бота).")

    await state.clear()

# 2. ОТВЕТ (REPLY)
@dp.callback_query(F.data.startswith("adm_reply_"))
async def cb_adm_reply(callback: CallbackQuery, state: FSMContext):
    target_user_id = callback.data.split("_")[2]
    await state.update_data(target_user_id=target_user_id)
    
    await callback.message.edit_text(
        f"💬 **РЕЖИМ ОТВЕТА**\nПолучатель ID: {target_user_id}\n\nНапишите ваш ответ:",
        reply_markup=kb_cancel(),
        parse_mode="Markdown"
    )
    await state.set_state(AdminState.waiting_for_reply)

@dp.message(AdminState.waiting_for_reply)
async def process_reply(message: Message, state: FSMContext):
    data = await state.get_data()
    target_user_id = int(data.get("target_user_id"))
    
    reply_msg = (
        f"⧉ **ОТВЕТ ОТ АДМИНИСТРАЦИИ**\n\n"
        f"{message.text}"
    )
    
    try:
        await bot.send_message(target_user_id, reply_msg)
        await message.answer("✅ Ответ доставлен.", reply_markup=kb_main_menu("#02"))
    except:
        await message.answer("❌ Ошибка отправки.")
    
    await state.clear()

# --- ХЕНДЛЕРЫ: ИВЕНТЫ (АДМИН) ---

@dp.callback_query(F.data == "admin_panel")
async def cb_admin_panel(callback: CallbackQuery):
    if get_rank(callback.from_user.id) != "#02":
        return await callback.answer("Доступ запрещен", show_alert=True)
    await callback.message.edit_text("⚙️ **ПАНЕЛЬ УПРАВЛЕНИЯ**", reply_markup=kb_admin_panel(), parse_mode="Markdown")

@dp.callback_query(F.data == "adm_add_event")
async def cb_add_event(callback: CallbackQuery, state: FSMContext):
    await callback.message.edit_text("Введите текст нового ивента:", reply_markup=kb_cancel())
    await state.set_state(AdminState.waiting_for_event_text)

@dp.message(AdminState.waiting_for_event_text)
async def process_event_text(message: Message, state: FSMContext):
    cursor.execute("INSERT INTO events (text) VALUES (?)", (message.text,))
    conn.commit()
    await message.answer("✅ Ивент опубликован в базу данных.", reply_markup=kb_main_menu("#02"))
    await state.clear()

@dp.callback_query(F.data == "adm_del_event_list")
async def cb_del_event_list(callback: CallbackQuery):
    cursor.execute("SELECT id, text FROM events")
    events = cursor.fetchall()
    
    if not events:
        await callback.answer("Список ивентов пуст", show_alert=True)
        return

    # Создаем кнопки для удаления
    buttons = []
    for ev in events:
        # Обрезаем текст для кнопки
        btn_text = f"🗑 {ev[1][:20]}..."
        buttons.append([InlineKeyboardButton(text=btn_text, callback_data=f"del_ev_{ev[0]}")])
    
    buttons.append([InlineKeyboardButton(text="[ НАЗАД ]", callback_data="admin_panel")])
    await callback.message.edit_text("Выберите ивент для удаления:", reply_markup=InlineKeyboardMarkup(inline_keyboard=buttons))

@dp.callback_query(F.data.startswith("del_ev_"))
async def cb_del_event_action(callback: CallbackQuery):
    ev_id = callback.data.split("_")[2]
    cursor.execute("DELETE FROM events WHERE id = ?", (ev_id,))
    conn.commit()
    await callback.answer("Ивент удален")
    await cb_del_event_list(callback) # Обновляем список

# --- ПРОСМОТР ИВЕНТОВ (ВСЕ) ---
@dp.callback_query(F.data == "show_events")
async def cb_show_events(callback: CallbackQuery):
    cursor.execute("SELECT text FROM events")
    events = cursor.fetchall()
    
    if not events:
        text = "⌬ **АКТИВНЫЕ ИВЕНТЫ**\n\nНа данный момент активных событий нет."
    else:
        text = "⌬ **АКТИВНЫЕ ИВЕНТЫ**\n\n"
        for i, ev in enumerate(events, 1):
            text += f"**#{i}** — {ev[0]}\n\n"
            
    rank = get_rank(callback.from_user.id)
    await callback.message.edit_text(text, reply_markup=InlineKeyboardMarkup(inline_keyboard=[[InlineKeyboardButton(text="[ НАЗАД ]", callback_data="menu_main")]]), parse_mode="Markdown")

# --- ЗАЩИТА ОТ УДАЛЕНИЯ БОТА ---
@dp.message(Command("ping"))
async def cmd_ping(message: Message):
    """Команда для проверки работы бота (защита от удаления)"""
    await message.answer("🟢 Бот активен и работает!")

@dp.message()
async def handle_all_messages(message: Message):
    """Обработчик всех сообщений для поддержания активности"""
    # Игнорируем сообщения в состояниях FSM (они обрабатываются выше)
    pass

# --- ЗАПУСК ---
async def main():
    print("⧉ BOT SYSTEM ONLINE...")
    # Устанавливаем команды бота
    await bot.set_my_commands([
        {"command": "start", "description": "Запустить бота"},
        {"command": "ping", "description": "Проверить статус бота"}
    ])
    
    # Отправляем уведомление владельцу о запуске
    try:
        await bot.send_message(OWNER_ID, "⧉ **СИСТЕМА ЗАПУЩЕНА**\nБот успешно активирован на сервере.", parse_mode="Markdown")
    except:
        pass
    
    await dp.start_polling(bot, allowed_updates=dp.resolve_used_update_types())

if __name__ == "__main__":
    asyncio.run(main())