# Set the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the project source code to the container
COPY . .

# Expose the port on which the Express.js application runs
EXPOSE 12000

# Copy the start script to the container
COPY start.sh ./

# Ensure the script is executable
RUN chmod +x start.sh

# Command to start the application
CMD ["./start.sh"]