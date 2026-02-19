# NΞN System Bot v2.0

Telegram бот с системой тикетов и ивентов.

## Деплой на Render

1. Создайте репозиторий на GitHub
2. Загрузите все файлы
3. Зайдите на [Render.com](https://render.com)
4. Создайте новый Web Service
5. Подключите GitHub репозиторий
6. Настройте переменные окружения (Environment Variables):
   - `BOT_TOKEN` - токен вашего бота
   - `OWNER_ID` - ваш Telegram ID

## Локальный запуск

```bash
pip install -r requirements.txt
python bot.py
```

## Функции

- Система тикетов с категориями
- Админ панель
- Управление ивентами
- База данных SQLite
