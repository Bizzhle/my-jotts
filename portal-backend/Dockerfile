# Use Node.js as the base image
FROM node:18-alpine

WORKDIR /app



COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "run", "start"]