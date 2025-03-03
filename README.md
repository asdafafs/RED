# RED

Web-интерфейс системы автоматической записи клиентов на занятия для автошколы RED

## Установка
1. Клонируйте репозиторий:
```
git clone https://github.com/user/myapp.git
```
2. Установите проект:
```
npm install
```
3. Компиляция и горячая перезагрузка для разработки:
```
npm run serve
```
4. Компиляция для продакшена:
```
npm run build
```
## Структура проекта  
📂 RED  
 ┣ 📂 public  
 ┣ 📂 src  
 ┃ ┣ 📂 assets/styles → стили css  
 ┃ ┣ 📂 components → Переиспользуемые компоненты и логотипы  
 ┃ ┣ 📂 dialogs → Диалоговые окна  
 ┃ ┣ 📂 mixins  
 ┃ ┣ 📂 plugins → Плагины JS для подключения диалоговых окон  
 ┃ ┣ 📂 views → Основные страницы  
 ┃ ┣ 📂 router → Файлы маршрутизации  
 ┃ ┣ 📂 services → API-запросы  
 ┃ ┣ 📂 store → Vuex  
 ┃ ┣ 📂 utils → Компоненты форматирования  
 ┃ ┣ 📂 views → Страницы приложения  
 ┃ ┣ 📜 main.js → Точка входа  
 ┃ ┗ 📜 App.vue → Главный компонент  
 ┣ 📜 .dockerignore  
 ┣ 📜 .gitignore  
 ┣ 📜 README.md  
 ┣ 📜 babel.config.js  
 ┣ 📜 jsconfig.json  
 ┣ 📜 package-lock.json  
 ┣ 📜 vue.config.js  
 ┗ 📜 package.json  

## Документация

Документация по Vue2: https://v2.vuejs.org/v2/guide/

Документация по Vuetify: https://vuetifyjs.com/en/getting-started/installation/#installation

Документация по Vue Router: https://vue-router-ru.netlify.app/introduction

Документация по Vuex: https://v3.vuex.vuejs.org/
