FROM node:latest


# Install ncc
# RUN npm i -g @zeit/ncc

# Install yarn
RUN npm i --force -g yarn

# Copy package.json
WORKDIR /app/msg_broker
COPY ./msg_broker/package.json .
RUN yarn install

# Copy files
COPY msg_broker .

# Install utils
WORKDIR /app/utils
COPY utils .
RUN yarn install
WORKDIR /app/msg_broker

# Build
RUN yarn build

EXPOSE 4000
CMD ["yarn", "start"]