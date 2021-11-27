FROM node:16-alpine

ENV NODE_ENV production
WORKDIR /usr/src/turbo-redirect

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --production

COPY . .
CMD ["yarn", "start"]