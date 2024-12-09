FROM node:21

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy rest of the application
COPY . .

# Set correct permissions
RUN chown -R node:node /app

# Switch to non-root user
USER node

EXPOSE 4001

CMD ["npm", "start"]