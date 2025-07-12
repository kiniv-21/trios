FROM node:20-alpine

WORKDIR /app

# Copy package files and install all deps (assumes vite is in package.json)
COPY package*.json ./
RUN npm install

# Copy rest of the code
COPY . .

# Expose Vite's default port
EXPOSE 5173

ENV HOST 0.0.0.0

# Use npx to ensure we run the local Vite version in node_modules
CMD ["npx", "vite"]
