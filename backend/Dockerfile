# Use the official Node.js image as the base image
FROM node:21

# Set the working directory inside the container
WORKDIR /app
COPY package.json package-lock.json ./

# RUN npm install -g nodemon
# Install dependencies
RUN npm install
RUN npm rebuild bcrypt --build-from-source
# RUN npm rebuild bcrypt --build-from-source

COPY . .

# Expose the port that the backend will run on (e.g., 3000)
RUN chown -R node:node /app
USER node
# Command to run the backend (adjust as necessary)
# CMD ["npm", "run", "start"]
EXPOSE 3000

CMD ["npm", "start"]
