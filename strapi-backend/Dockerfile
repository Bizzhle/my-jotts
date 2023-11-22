# Use the official Strapi base image
FROM node:14-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock files
COPY package*.json ./

# Install dependencies
RUN npm install

RUN npm build

# Copy the rest of the app code
COPY . .

# Expose the Strapi port
EXPOSE 1337

# Start Strapi
CMD ["npm", "run", "develop"]
