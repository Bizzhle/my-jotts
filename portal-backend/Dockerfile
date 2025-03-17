FROM node:18-alpine as development

LABEL version="1.0"
LABEL description="Development image for portal backend"

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=development
RUN npm install -g nodemon

COPY . .

# Add the PostgreSQL setup script
# ADD setup_database.sh /usr/src/app/setup_database.sh
# RUN chmod +x /usr/src/app//setup_database.sh
# RUN ./setup_database.sh

RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start:debug"]


FROM node:18-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production


COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/node_modules ./node_modules


EXPOSE 4000

CMD ["node", "dist/src/main"]