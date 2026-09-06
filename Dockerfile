# Multi-stage Dockerfile for Blockbuster on Cloud Run
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package descriptors and install dependencies
COPY package*.json ./
RUN npm ci

# Copy project source and build static bundle
COPY . .
RUN npm run build

# Stage 2: Serve with NGINX Alpine
FROM nginx:alpine

# Copy built assets to NGINX html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom NGINX configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Support custom dynamic PORT passed by Cloud Run
ENV PORT=8080
EXPOSE 8080

CMD ["sh", "-c", "sed -i 's/listen 8080;/listen '\"$PORT\"';/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
