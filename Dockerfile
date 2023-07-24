FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT 8000
ENV TOKEN_URL ""
ENV GET_EAN_URL ""
ENV USERNAME ""
ENV PASSWORD ""
ENV ALLOWED_ORIGINS_ARRAY "[]"

EXPOSE $PORT

CMD ["node", "main.mjs"]