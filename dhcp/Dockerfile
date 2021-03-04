FROM balenalib/raspberrypi4-64-ubuntu-node as run

WORKDIR /app

# Import project
COPY dhcp/built .
COPY dhcp/package.json .
RUN yarn install

EXPOSE 67
EXPOSE 4000

CMD ["yarn", "start"]