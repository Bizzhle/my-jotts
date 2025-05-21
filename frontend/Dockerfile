FROM node:23-alpine as base

LABEL description="Frontend for MyJotts"

# Set the working directory
WORKDIR /app

COPY package.json package-lock.json ./ 
RUN npm install

# ---------- Build Stage ----------
FROM base as builder

COPY src ./src
COPY public ./public
COPY tsconfig*.json vite.config.ts index.html ./

# Copy environment variables used by Vite at build time
COPY .env ./

RUN npm run build

# ---------- Production Stage ----------
FROM nginx:alpine as production

RUN rm /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf 

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

