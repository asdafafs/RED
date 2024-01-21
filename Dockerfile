FROM node:16-alpine3.17 as builder
WORKDIR /app
COPY . .
ENV FRONT_PAGE_URL=https://red.techbeaver.ru
ENV BACKEND_URL=https://red-backend.techbeaver.ru
ENV CLIENT_ID=51785736
ENV REDIRECT_URI=https://red.techbeaver.ru/post-login
ENV DISPLAY=popup
ENV RESPONSE_TYPE=code
RUN npm install && \
    npm run build 

FROM nginx:1.25.3
COPY --from=builder /app/dist /usr/share/nginx/html