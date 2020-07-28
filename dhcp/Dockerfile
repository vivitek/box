# FROM balenalib/raspberrypi3-alpine-node:latest
FROM node:latest

# Install yarn
RUN npm i --force -g yarn

# Copy package.json
WORKDIR /app/dhcp
COPY ./dhcp/package.json .
RUN yarn install

# Copy files
COPY dhcp .

# Install utils
WORKDIR /app/utils
COPY utils .
RUN yarn install
WORKDIR /app/dhcp

# Build
RUN yarn build

RUN ls -l built/utils
RUN ls -l built/utils/msgMgr

EXPOSE 67
CMD ["node", "index.js"]