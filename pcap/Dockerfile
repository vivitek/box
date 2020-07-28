FROM node:12-buster

# install libpcap
RUN apt-get update -y
RUN apt-get install -y libpcap-dev

# install ncc
# RUN npm i -g @zeit/ncc

# Install yarn
RUN npm i --force -g yarn


# Copy package.json
WORKDIR /app/pcap
COPY ./pcap/package.json .
RUN yarn install

# Copy files
COPY pcap .

# Install utils
WORKDIR /app/utils
COPY utils .
RUN yarn install
WORKDIR /app/pcap

# Build
RUN yarn build

EXPOSE 5000
CMD yarn start