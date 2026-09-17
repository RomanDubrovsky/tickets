FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy source code and server
COPY . .

ENV PORT=3001
EXPOSE 3001

CMD ["node", "server/index.js"]
