FROM node:latest

RUN apt-get update -y
RUN apt-get install -y libpcap-dev

EXPOSE 5000
WORKDIR /code

# copy files
COPY . .

RUN npm i
RUN npm run build

CMD npm start