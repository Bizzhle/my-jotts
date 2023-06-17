FROM node:18-alpine

LABEL version="1.0"
LABEL description="Production image for portal backend"

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

