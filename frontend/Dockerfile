# Use the official Node.js image as the base image
FROM node:21

# Set the working directory inside the container
WORKDIR /app
COPY package.json package-lock.json ./
# Install dependencies
RUN npm install
RUN npm rebuild bcrypt --build-from-source

# Expose the port that the backend will run on (e.g., 3000)
EXPOSE 4001
RUN chown -R node:node /app
USER node
# Command to run the backend (adjust as necessary)
CMD ["npm", "run", "start"]
