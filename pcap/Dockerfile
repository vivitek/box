FROM node:lts
WORKDIR /app
RUN apt install -y libpcap-dev python3 build-essential
COPY package.json .
RUN npm install
RUN npm install typescript -g 
COPY . .
RUN tsc
CMD ["node", "dist/server.js"]
