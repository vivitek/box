# Build project
# FROM balenalib/aarch64-ubuntu-node as build
# FROM node:lts as build

# # Install yarn
# RUN npm i -g --force yarn

# WORKDIR /app/container

# # Install dependencies
# COPY container/package.json .
# RUN yarn install

# # Import and build project
# COPY container .
# WORKDIR /app/utils
# COPY utils .
# WORKDIR /app/container
# RUN yarn build

# Run app in container
# FROM node:lts as run
FROM balenalib/aarch64-alpine-node as run

WORKDIR /app

# Import project
COPY agent/built .
COPY agent/package.json .
RUN npm i

CMD ["node", "agent/src/index.js"]