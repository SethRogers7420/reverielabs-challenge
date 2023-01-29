FROM node:18-buster as base


WORKDIR /usr/src/app

# Copy everything not in the dockerignore
COPY . .

# Install dependencies
RUN cd ./api && npm install

RUN cd ./client && npm install && npm run build

ENV NODE_ENV=production

EXPOSE 7000

WORKDIR /usr/src/app/api

CMD [ "node", "-r", "ts-node/register", "./index.ts" ]
