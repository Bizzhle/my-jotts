FROM node:18-alpine as builder

LABEL description="Frontend for MyJotts"

# Set the working directory
WORKDIR /app

COPY package.json ./ 

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5173
CMD ["npm", "run", "dev", "--","--host","0.0.0.0"]



# # Copy package.json and package-lock.json
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy the rest of the application files
# COPY . .

# # Build the application
# RUN npm run build

# FROM nginx:alpine

# COPY --from=builder /app/dist /usr/share/nginx/html

# # Expose the port the app runs on
# EXPOSE 80

# # Command to run the application
# CMD ["nginx", "-g", "daemon off;"]