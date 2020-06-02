FROM node:latest

WORKDIR /code

# copy files
COPY package.json .
RUN npm i

COPY . .
RUN npm run build

EXPOSE 4000
CMD ["npm", "start"]