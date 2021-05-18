FROM node:lts

COPY package.json .
RUN npm install
RUN npm install typescript -g
COPY . .
RUN tsc
CMD ["node", "dist/index.js"]
