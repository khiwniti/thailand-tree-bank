# Frontend Dockerfile for Northflank
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build arguments (these will be provided by Northflank)
ARG VITE_LIFF_ID
ARG VITE_GEMINI_API_KEY
ARG VITE_API_URL

# Set environment variables for build
ENV VITE_LIFF_ID=$VITE_LIFF_ID
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY
ENV VITE_API_URL=$VITE_API_URL

# Build the app
RUN npm run build

# Production stage - nginx to serve static files
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
