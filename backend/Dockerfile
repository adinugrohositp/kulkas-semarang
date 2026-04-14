FROM node:18-alpine

# Install build dependencies for better-sqlite3
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./

# Install dependencies and rebuild native modules
RUN npm install --production
RUN npm rebuild better-sqlite3

COPY . .

EXPOSE 3001

CMD ["node", "server.js"]
