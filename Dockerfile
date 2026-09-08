# Multi-stage Dockerfile for Blockbuster on Cloud Run
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package descriptors and install dependencies
COPY package*.json ./
RUN npm ci

# Copy project source and build static bundle
COPY . .
RUN npm run build

# Stage 2: Serve with Node 20 runtime on Cloud Run (Auto-authenticates with GCP Service Account Metadata)
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled static assets and server code
COPY --from=builder /app/dist ./dist
COPY server.js ./
COPY src/services/directorAgentService.js ./src/services/directorAgentService.js

ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]
