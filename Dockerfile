# # # Use Node.js LTS version
# # FROM --platform=linux/amd64 node:20-slim AS builder

# # # Install OpenSSL - required by Prisma
# # RUN apt-get update -y && apt-get install -y openssl

# # # Set working directory
# # WORKDIR /app

# # # Copy package files
# # COPY package*.json ./

# # # Install all dependencies
# # RUN npm ci

# # # Copy necessary project files
# # COPY . .

# # # Generate Prisma client first
# # RUN npx prisma generate

# # # Build the application with verbose output
# # RUN npm run build || (echo "Build failed. Here's the error:" && tsc --listFiles && tsc --listEmittedFiles && exit 1)

# # # Create production image
# # FROM --platform=linux/amd64 node:20-slim AS runtime

# # # Install OpenSSL - required by Prisma
# # RUN apt-get update -y && apt-get install -y openssl

# # WORKDIR /app

# # # Copy package files
# # COPY package*.json ./

# # # Install only production dependencies
# # RUN npm ci --only=production

# # # Copy prisma schema and migrations
# # COPY prisma ./prisma/

# # # Copy built application 
# # COPY --from=builder /app/build ./build

# # # Copy Prisma generated files
# # COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
# # COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# # # Create data directory for quotes storage
# # RUN mkdir -p ./data

# # # Set environment variables
# # ENV NODE_ENV=production
# # ENV PORT=8080

# # # Expose port
# # EXPOSE 8080

# # # Start the application
# # CMD ["node", "build/src/app.js"]

# # Use Node.js LTS version
# FROM --platform=linux/amd64 node:20-slim AS builder

# # Install OpenSSL - required by Prisma
# RUN apt-get update -y && apt-get install -y openssl

# # Set working directory
# WORKDIR /app

# # Copy package files
# COPY package*.json ./

# # Install all dependencies
# RUN npm ci

# # Copy necessary project files
# COPY . .

# # Generate Prisma client first
# RUN npx prisma generate

# # Build the application
# RUN npm run build

# # Create production image
# FROM --platform=linux/amd64 node:20-slim AS runtime

# # Install OpenSSL - required by Prisma
# RUN apt-get update -y && apt-get install -y openssl

# WORKDIR /app

# # Copy package files
# COPY package*.json ./

# # Install only production dependencies
# RUN npm ci --only=production

# # Copy prisma schema and migrations
# COPY prisma ./prisma/

# # Copy built application
# COPY --from=builder /app/build ./build

# # Copy Prisma generated files
# COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
# COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# # Create data directory for quotes storage
# RUN mkdir -p ./data

# # Set environment variables
# ENV NODE_ENV=production
# ENV PORT=8080

# # Expose port
# EXPOSE 8080

# # Create start script to handle Prisma
# RUN echo '#!/bin/sh\nnpx prisma generate\nnode build/src/app.js' > /app/start.sh && chmod +x /app/start.sh

# # Start the application with Prisma generation
# CMD ["/app/start.sh"]

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npm run prisma:generate  # This line is critical
COPY . .

RUN npm run build

EXPOSE 8080

CMD [ "node", "build/src/app.js" ]