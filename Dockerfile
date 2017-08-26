FROM node:latest

WORKDIR /app

ADD . /app

RUN npm install

EXPOSE 80

ENV SERVER_PORT 80

CMD ["node", "server/server.js"]



