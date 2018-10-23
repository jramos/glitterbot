FROM node:alpine

COPY package.json yarn.lock ./
RUN yarn install --no-cache --frozen-lockfile --production

COPY src/* ./

CMD ["node", "glitterbot.js"]
