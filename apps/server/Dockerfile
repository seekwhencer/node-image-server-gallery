FROM node:14

WORKDIR /home/node/app/apps/shared
COPY package.json .
RUN npm install
COPY . .

WORKDIR /home/node/app/apps/server
COPY package.json .
RUN npm install
COPY . .

