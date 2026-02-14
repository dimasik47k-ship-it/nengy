# Настройка MongoDB Atlas для shorto

## Шаг 1: Создание аккаунта MongoDB Atlas

1. Перейдите на https://www.mongodb.com/cloud/atlas/register
2. Зарегистрируйтесь (бесплатный план M0 подходит для начала)
3. Войдите в панель управления

## Шаг 2: Создание кластера

1. Нажмите "Build a Database"
2. Выберите **FREE** план (M0 Sandbox)
3. Выберите регион (рекомендуется ближайший к вашим пользователям)
4. Назовите кластер (например, `shorto-cluster`)
5. Нажмите "Create"

## Шаг 3: Настройка доступа

### 3.1 Создание пользователя базы данных

1. В разделе "Security" → "Database Access"
2. Нажмите "Add New Database User"
3. Выберите "Password" authentication
4. Введите:
   - Username: `shorto_user`
   - Password: (сгенерируйте надежный пароль)
5. Database User Privileges: выберите "Read and write to any database"
6. Нажмите "Add User"

**ВАЖНО:** Сохраните пароль - он понадобится для строки подключения!

### 3.2 Настройка Network Access

1. В разделе "Security" → "Network Access"
2. Нажмите "Add IP Address"
3. Выберите "Allow Access from Anywhere" (0.0.0.0/0)
   - Это нужно для Netlify Functions
4. Нажмите "Confirm"

## Шаг 4: Получение строки подключения

1. Вернитесь в "Database" → "Clusters"
2. Нажмите кнопку "Connect" на вашем кластере
3. Выберите "Connect your application"
4. Выберите Driver: **Node.js** и Version: **4.1 or later**
5. Скопируйте строку подключения, она будет выглядеть так:
   ```
   mongodb+srv://shorto_user:<password>@shorto-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Замените `<password>` на ваш реальный пароль

## Шаг 5: Настройка переменных окружения в Netlify

1. Откройте ваш сайт в Netlify Dashboard
2. Перейдите в "Site settings" → "Environment variables"
3. Добавьте две переменные:

   **MONGODB_URI**
   ```
   mongodb+srv://shorto_user:ВАШ_ПАРОЛЬ@shorto-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

   **MONGODB_DB**
   ```
   shorto
   ```

4. Нажмите "Save"
5. Перейдите в "Deploys" и нажмите "Trigger deploy" → "Clear cache and deploy site"

## Шаг 6: Проверка

После деплоя:
1. Откройте ваш сайт на Netlify
2. Создайте несколько коротких ссылок
3. Проверьте в MongoDB Atlas:
   - Перейдите в "Database" → "Browse Collections"
   - Вы должны увидеть базу данных `shorto` с коллекциями `links` и `users`

## Локальная разработка

Для локальной разработки создайте файл `.env` в корне проекта:

```env
MONGODB_URI=mongodb+srv://shorto_user:ВАШ_ПАРОЛЬ@shorto-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=shorto
```

Установите `dotenv`:
```bash
npm install dotenv
```

## Мониторинг

В MongoDB Atlas вы можете:
- Просматривать данные в реальном времени
- Настроить автоматические бэкапы
- Отслеживать производительность
- Настроить алерты

## Лимиты бесплатного плана M0

- 512 MB хранилища
- Shared RAM
- Shared vCPU
- Достаточно для ~100,000 коротких ссылок

Для масштабирования можно перейти на платный план.
