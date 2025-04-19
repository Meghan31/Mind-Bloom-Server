# # # # # # Use Node.js 20 Alpine image (LTS version)
# # # # # FROM node:20-alpine

# # # # # # Set environment to production
# # # # # ENV NODE_ENV=production

# # # # # ENV NODE_ENV production

# # # # # # Create app directory
# # # # # WORKDIR /app

# # # # # # Install system dependencies
# # # # # RUN apk add --no-cache bash

# # # # # # Copy package files
# # # # # COPY package*.json ./

# # # # # # Install ALL dependencies (including dev) for building
# # # # # RUN npm ci

# # # # # # Copy all project files
# # # # # COPY . .

# # # # # # Generate Prisma client
# # # # # RUN npm run prisma:generate

# # # # # # Build the application
# # # # # RUN npm run build

# # # # # # Expose the application port
# # # # # EXPOSE 8787

# # # # # # Copy shell scripts and make them executable
# # # # # COPY bin/app.sh ./app.sh
# # # # # COPY bin/analyze.sh ./analyze.sh
# # # # # COPY bin/collect.sh ./collect.sh
# # # # # RUN chmod +x ./*.sh

# # # # # # Use production dependencies for final image
# # # # # RUN npm prune --production

# # # # # # Copy built files
# # # # # COPY --from=0 /app/build ./build
# # # # # COPY --from=0 /app/node_modules ./node_modules

# # # # # # Default entrypoint
# # # # # ENTRYPOINT ["./app.sh"]


# # # # # Use Node.js 20 Alpine image
# # # # FROM node:20-alpine

# # # # # Set environment to production
# # # # ENV NODE_ENV production

# # # # # Create app directory
# # # # WORKDIR /app

# # # # # Install system dependencies
# # # # RUN apk add --no-cache bash

# # # # # Copy package files
# # # # COPY package*.json ./

# # # # # Install ALL dependencies 
# # # # RUN npm ci

# # # # # Copy all project files
# # # # COPY . .

# # # # # Generate Prisma client
# # # # RUN npm run prisma:generate

# # # # # Build the application
# # # # RUN npm run build

# # # # # Remove dev dependencies
# # # # RUN npm prune --production

# # # # # Expose the application port
# # # # EXPOSE 8787

# # # # # Copy shell scripts and make them executable
# # # # COPY bin/app.sh ./app.sh
# # # # COPY bin/analyze.sh ./analyze.sh
# # # # COPY bin/collect.sh ./collect.sh
# # # # RUN chmod +x ./*.sh

# # # # # Default entrypoint
# # # # ENTRYPOINT ["./app.sh"]

# # # # Use Node.js 20 Alpine image




# # # # Use Node.js 20 Alpine image
# # # FROM node:20-alpine

# # # # Set environment to production
# # # ENV NODE_ENV=production

# # # # Create app directory
# # # WORKDIR /app

# # # # Install system dependencies
# # # RUN apk add --no-cache bash

# # # # Copy package files
# # # COPY package*.json ./

# # # # Install ALL dependencies, including dev dependencies
# # # RUN npm ci

# # # # Install type definitions explicitly
# # # RUN npm install --save-dev \
# # #     @types/bcrypt \
# # #     @types/cors \
# # #     @types/express \
# # #     @types/jsonwebtoken \
# # #     @types/node \
# # #     @types/pg

# # # # Copy all project files
# # # COPY . .

# # # # Generate Prisma client
# # # RUN npm run prisma:generate

# # # # Verify type definitions are installed
# # # RUN ls -l node_modules/@types

# # # # Build the application with verbose output
# # # RUN npm run build --verbose

# # # # Remove dev dependencies
# # # RUN npm prune --production

# # # # Expose the application port
# # # EXPOSE 8787

# # # # Copy shell scripts and make them executable
# # # COPY bin/app.sh ./app.sh
# # # COPY bin/analyze.sh ./analyze.sh
# # # COPY bin/collect.sh ./collect.sh
# # # RUN chmod +x ./*.sh

# # # # Default entrypoint
# # # ENTRYPOINT ["./app.sh"]

# # FROM node:22-alpine

# # ENV NODE_ENV production

# # WORKDIR /app
# # COPY package*.json ./
# # COPY databases ./databases
# # RUN npm ci --omit-dev
# # COPY prisma ./prisma
# # RUN npm run prisma:generate
# # COPY build ./build

# # COPY ./bin/app.sh ./app.sh
# # COPY ./bin/analyze.sh ./analyze.sh
# # COPY ./bin/collect.sh ./collect.sh

# # ENTRYPOINT [ "./app.sh" ]

# FROM node:22-alpine AS builder

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY prisma ./prisma/
# RUN npx prisma generate

# COPY . .
# RUN npm run build

# FROM node:22-alpine

# WORKDIR /app

# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package*.json ./
# COPY --from=builder /app/build ./build
# COPY --from=builder /app/prisma ./prisma

# CMD ["node", "build/app.js"]

FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .
RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/build ./build
COPY --from=builder /app/prisma ./prisma

RUN apk add --no-cache --virtual .gyp python3 make g++
RUN npm rebuild bcrypt

CMD ["node", "build/app.js"]