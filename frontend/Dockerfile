FROM node:18-alpine as builder

LABEL description="Frontend for MyJotts"

# Set the working directory
WORKDIR /app

COPY package.json package-lock.json ./ 

RUN npm install

COPY . .


RUN npm run build

FROM nginx:alpine as production

RUN rm /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf 

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

