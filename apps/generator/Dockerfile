FROM node:14

WORKDIR /home/node/app/apps/shared
COPY shared/package.json .
RUN npm install
COPY . .

WORKDIR /home/node/app/apps/generator
COPY generator/package.json .
RUN npm install
COPY . .
