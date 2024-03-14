#!/bin/bash

# Путь к файлу .env
env_file=".env"

# Проверка существования файла .env
if [ ! -f "$env_file" ]; then
    echo "Ошибка: Файл .env не найден."
    exit 1
fi

sed -i "s/^FRONTEND_VERSION=.*/FRONTEND_VERSION=$FRONTEND_VERSION/" "$env_file"
docker compose down red-schedule-frontend
docker compose up -d