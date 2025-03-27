FROM node:18-alpine as development

LABEL description="Development image for portal backend"

WORKDIR /app

COPY package*.json ./

RUN npm install --omit-dev=false
RUN npm install -g nodemon

COPY . .

# Add the PostgreSQL setup script
# ADD setup_database.sh /usr/src/app/setup_database.sh
# RUN chmod +x /usr/src/app//setup_database.sh
# RUN ./setup_database.sh

RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start:dev"]

FROM node:18-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json ./

RUN npm install --omit-dev=true

COPY --from=development /app/dist ./dist
COPY --from=development /app/node_modules ./node_modules


EXPOSE 4000

CMD ["node", "dist/src/main"]