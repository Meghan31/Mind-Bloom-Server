FROM node:20-slim

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies 
RUN npm install


RUN npm run prisma:generate  

RUN npm run build

# Copy the rest of the application
COPY . .

# Make the script executable
RUN chmod +x ./bin/daily-quotes.sh

# Set the entrypoint to run the script
ENTRYPOINT ["./bin/daily-quotes.sh"]




