FROM node:20-slim

WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Copy prisma schema and related files (this is what's missing)
COPY prisma/ ./prisma/

# Install dependencies 
RUN npm install

# Optional: Install OpenSSL (addressing the warning in the logs)
RUN apt-get update -y && apt-get install -y openssl

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Make the script executable
RUN chmod +x ./bin/daily-quotes.sh

# Set environment variables (these will be overridden by CI/CD)
ENV NODE_ENV=production

# Expose the port your application uses
EXPOSE 8080

# Start the application
CMD ["node", "build/src/app.js"]