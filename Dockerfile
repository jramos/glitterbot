FROM node:alpine

COPY package*.json ./
RUN npm install

COPY *.js ./

CMD node glitterbot.js
