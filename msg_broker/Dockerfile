FROM node:latest

WORKDIR /code

# install ncc
RUN npm i -g @zeit/ncc

# copy files
COPY package.json .
RUN npm i

COPY . .
RUN npm run build

EXPOSE 4000
CMD ["npm", "start"]