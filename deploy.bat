@echo off
chcp 65001 >nul
echo 🚀 Деплой NΞN System Bot
echo.

REM Инициализация Git
git init

REM Добавление всех файлов
git add .

REM Коммит
git commit -m "Deploy NEN System Bot v2.0"

REM Установка ветки main
git branch -M main

REM Добавление remote
echo ⚠️  Замените URL на ваш GitHub репозиторий!
echo Пример: https://github.com/dimasik47k-ship-it/nen-system-bot.git
set /p REPO_URL="Введите URL вашего репозитория: "

git remote add origin %REPO_URL%

REM Push на GitHub
git push -u origin main

echo.
echo ✅ Файлы загружены на GitHub!
echo Теперь подключите репозиторий на Render.com
pause
