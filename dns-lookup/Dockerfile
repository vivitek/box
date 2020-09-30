FROM node:lts

RUN npm i -g --force yarn

WORKDIR /app

COPY dns-lookup/package.json .
RUN yarn install

COPY dns-lookup .
RUN ls -l

CMD ["yarn", "dev"]