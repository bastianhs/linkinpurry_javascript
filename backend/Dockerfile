# Use the official Node.js image as the base image
FROM node:21

# Set the working directory inside the container
WORKDIR /app
COPY package.json package-lock.json ./

# RUN npm install -g nodemon
# Install dependencies
RUN npm install
# RUN npm rebuild bcrypt --build-from-source

COPY . .

# Expose the port that the backend will run on (e.g., 3000)
RUN chown -R node:node /app
USER node

COPY --chown=node:node package*.json ./

RUN npm ci

COPY ./.env.example ./.env

ENV PORT=4001

EXPOSE 4001
RUN npm rebuild bcrypt --build-from-source
CMD ["npm", "rebuild", "bcrypt", "--build-from-source"]

CMD ["npm", "run", "start"]
