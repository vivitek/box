# FROM balenalib/raspberrypi3-alpine-node:latest
FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm i

COPY . .

EXPOSE 67
CMD ["node", "server.js"]