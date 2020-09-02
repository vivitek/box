# Build project
FROM node:lts as build

# Install yarn
RUN npm i -g --force yarn

WORKDIR /app

# Install dependencies
COPY container/package.json .
RUN yarn install

# Import and build project
COPY container .
COPY utils ./utils
RUN pwd
RUN ls -la
RUN yarn build

# Run app in container
FROM balenalib/aarch64-ubuntu-node as run

WORKDIR /app

# Import project
COPY --from=build /app .

CMD ["yarn", "start"]