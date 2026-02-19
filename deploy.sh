#!/bin/bash
# Скрипт для быстрого деплоя на GitHub

echo "🚀 Деплой NΞN System Bot"
echo ""

# Инициализация Git
git init

# Добавление всех файлов
git add .

# Коммит
git commit -m "Deploy NΞN System Bot v2.0"

# Установка ветки main
git branch -M main

# Добавление remote (замените URL на свой)
echo "⚠️  Замените URL на ваш GitHub репозиторий!"
echo "Пример: git remote add origin https://github.com/dimasik47k-ship-it/nen-system-bot.git"
read -p "Введите URL вашего репозитория: " REPO_URL

git remote add origin $REPO_URL

# Push на GitHub
git push -u origin main

echo ""
echo "✅ Файлы загружены на GitHub!"
echo "Теперь подключите репозиторий на Render.com"
