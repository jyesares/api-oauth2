# Use an official node runtime as a parent image
FROM node:9.10.1-alpine

# Create dest folder
RUN mkdir /app

# Set working directory of application
WORKDIR /app

# Copy package.json into application folder
COPY package.json /app

# Install yarn
RUN npm install yarn

# Install node modules
RUN yarn

# Copy current directory into host app directory
COPY . /app

# Application default port
EXPOSE 3000

# Run npm start on host
CMD [ "yarn", "start" ]