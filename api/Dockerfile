FROM node:18-buster as base


WORKDIR /usr/src/app

# Copy our package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy everything not in the dockerignore
COPY . .

ENV NODE_ENV=production

EXPOSE 7000

CMD [ "node", "-r", "ts-node/register", "./index.ts" ]
