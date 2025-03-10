FROM node:20

WORKDIR /Users/src/app

COPY package.json ./

RUN npm install

COPY ./ ./

CMD ["npm","run","start:dev"]