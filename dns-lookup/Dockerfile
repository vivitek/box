FROM node:lts

RUN npm i -g --force yarn

WORKDIR /app

COPY package.json .
RUN yarn install

COPY . .

CMD ["yarn", "dev"]