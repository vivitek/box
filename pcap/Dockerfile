FROM balenalib/raspberrypi4-64-ubuntu-node as run
  
WORKDIR /app

# Install libpcap
RUN install_packages libpcap-dev
RUN install_packages build-essential python3 python3-pip python3-setuptools

# Import project
COPY pcap/built .
COPY pcap/package.json .
RUN yarn

CMD ["yarn", "start"]