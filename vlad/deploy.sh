#!/bin/bash

# Путь к файлу .env
env_file=".env"

# Проверка существования файла .env
if [ ! -f "$env_file" ]; then
    echo "Ошибка: Файл .env не найден."
    exit 1
fi

sed -i "s/^FRONTEND_VERSION=.*/FRONTEND_VERSION=$FRONTEND_VERSION/" "$env_file"
docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY;
docker pull $CI_REGISTRY_IMAGE/red/red-frontend-vlad:$FRONTEND_VERSION
docker compose down
docker compose up -d