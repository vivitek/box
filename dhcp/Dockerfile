FROM balenalib/aarch64-alpine-node as run

WORKDIR /app

# Import project
COPY dhcp .
RUN ls -l
RUN rm -rf node_modules
RUN yarn install

EXPOSE 67
EXPOSE 4000

CMD ["node", "src/index.js"]