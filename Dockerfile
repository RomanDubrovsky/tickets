FROM node:20-alpine

WORKDIR /app

# Copy server package.json and install
COPY server/package*.json ./server/
RUN cd server && npm install --production

# Copy server code
COPY server/ ./server/
# (Removed .env copy)

EXPOSE 3001

# The PORT env variable will be provided by Yandex Serverless, but fallback is 3001
CMD ["node", "server/index.js"]
