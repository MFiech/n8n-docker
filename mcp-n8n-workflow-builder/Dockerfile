# Start from an official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package manifests and install production deps
COPY package*.json ./
RUN npm install --production

# Copy source code
COPY . .

# Compile TypeScript into build/
RUN npm run build

# Launch the server from the compiled output
CMD ["node", "build/index.js"]
