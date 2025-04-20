# Use Node.js LTS (Long Term Support) version with specific platform flag for compatibility
FROM --platform=linux/amd64 node:20-slim AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Create production image
FROM --platform=linux/amd64 node:20-slim AS runtime

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy prisma schema and migrations
COPY --from=builder /app/prisma ./prisma

# Copy built application
COPY --from=builder /app/build ./build

# Copy Prisma generated files
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Create data directory for quotes storage
RUN mkdir -p ./data

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose port
EXPOSE 8080

# Start the application
CMD ["node", "build/app.js"]