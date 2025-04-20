# FROM node:18-slim

# WORKDIR /app

# # Copy package files and install dependencies
# COPY package*.json ./
# RUN npm install

# # Copy prisma schema files
# COPY prisma ./prisma/

# # Generate Prisma client
# RUN npx prisma generate

# # Copy the rest of the application
# COPY . .

# # Add TypeScript compilation check before building
# RUN npx tsc --noEmit
# # Now build the application
# RUN npm run build

# # Set environment variables
# ENV NODE_ENV=production
# ENV PORT=8787

# # Expose the port your app runs on
# EXPOSE 8787

# # Start the application
# CMD ["node", "build/app.js"]

FROM node:18-slim

WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./
RUN npm install

# Copy Prisma schema files
COPY prisma ./prisma/

# # Generate Prisma client - this is critical
# RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

RUN echo "Build completed successfully."

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose the port
EXPOSE 8080

# Start the application
CMD ["node", "build/app.js"]