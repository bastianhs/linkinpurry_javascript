# Use the official Node.js image as the base image
FROM node:21

# Set the working directory inside the container
WORKDIR /app
COPY package.json package-lock.json ./
# Install frontend dependencies
RUN npm install

COPY . .

RUN chown -R node:node /app
USER node

# Expose the port that the frontend will run on (e.g., 3001)
EXPOSE 3000

# Command to run the frontend (adjust as necessary)
CMD ["npm", "run", "start"]
