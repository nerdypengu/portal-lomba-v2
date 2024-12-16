# Step 1: Base image
FROM node:20-alpine

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Step 4: Copy application code
COPY . .

# Step 5: Expose the required port and run the server
EXPOSE 8080
CMD ["node", "server.js"]
