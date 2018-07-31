FROM node:alpine

COPY package.json yarn.lock ./
RUN yarn install

COPY *.js ./

CMD node glitterbot.js
