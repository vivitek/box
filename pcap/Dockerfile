FROM node:latest

# install libpcap
RUN apt-get update -y
RUN apt-get install -y libpcap-dev

# install ncc
RUN npm i -g @zeit/ncc

EXPOSE 5000
WORKDIR /code

# copy files
COPY . .

RUN npm i
RUN npm run build

CMD npm start