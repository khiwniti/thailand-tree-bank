# Backend Dockerfile for Northflank
FROM node:20-alpine AS builder

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./

# Install dependencies (using npm install for Railway CLI compatibility)
RUN npm install

# Copy all source code (includes prisma/, src/, tsconfig.json)
COPY . .

# Build TypeScript (skip Prisma generation - will do at runtime)
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install OpenSSL for Prisma in production image
RUN apk add --no-cache openssl libssl3

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm install --production

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma

# Create uploads directory
RUN mkdir -p uploads

# Expose port (Northflank will use PORT env var)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start server (generate Prisma client at runtime, then start)
CMD npx prisma generate && node dist/index.js
