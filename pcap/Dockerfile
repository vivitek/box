FROM node:latest

EXPOSE 4040
WORKDIR /code

# copy files
COPY . .

RUN npm i
RUN npm run build

CMD npm start