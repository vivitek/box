FROM node:lts

COPY . .
RUN npm i
RUN npm i -g typescript
RUN tsc
CMD ["node", "dist/main.js"]