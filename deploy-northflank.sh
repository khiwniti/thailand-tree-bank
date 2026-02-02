#!/bin/bash

# 🚀 Quick Deploy Script for Northflank
# Tree Bank LINE Mini App

set -e  # Exit on error

echo "🌳 Tree Bank - Northflank Deployment Script"
echo "============================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
LIFF_ID="2008934197-jM9Zoogn"
PROJECT_NAME="tree-bank"

echo -e "${BLUE}Step 1: Checking prerequisites...${NC}"

# Check if northflank CLI is installed
if ! command -v northflank &> /dev/null; then
    echo -e "${YELLOW}Northflank CLI not found. Installing...${NC}"
    npm install -g @northflank/cli
fi

# Check if logged in
if ! northflank whoami &> /dev/null; then
    echo -e "${YELLOW}Not logged in to Northflank. Please login:${NC}"
    northflank login
fi

echo -e "${GREEN}✓ Prerequisites OK${NC}"
echo ""

# Get user input
echo -e "${BLUE}Step 2: Configuration${NC}"
read -p "Enter Gemini API Key (or press Enter to skip AI features): " GEMINI_KEY
read -p "Enter JWT Secret (or press Enter to auto-generate): " JWT_SECRET
read -p "Enter LINE Channel Secret (from LINE Console): " LINE_SECRET

# Generate JWT secret if not provided
if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET=$(openssl rand -base64 32)
    echo "Generated JWT Secret: $JWT_SECRET"
fi

echo ""
echo -e "${BLUE}Step 3: Creating secrets in Northflank...${NC}"

# Create secrets
if [ ! -z "$GEMINI_KEY" ]; then
    northflank secret create gemini-api-key --value "$GEMINI_KEY" --project "$PROJECT_NAME" || true
fi

northflank secret create jwt-secret --value "$JWT_SECRET" --project "$PROJECT_NAME" || true

if [ ! -z "$LINE_SECRET" ]; then
    northflank secret create line-channel-secret --value "$LINE_SECRET" --project "$PROJECT_NAME" || true
fi

echo -e "${GREEN}✓ Secrets created${NC}"
echo ""

echo -e "${BLUE}Step 4: Deploying backend...${NC}"

# Deploy backend
cd backend

northflank service create \
  --name tree-bank-backend \
  --project "$PROJECT_NAME" \
  --dockerfile Dockerfile \
  --context . \
  --port 8080 \
  --env NODE_ENV=production \
  --env PORT=8080 \
  --env DATABASE_URL="postgresql://_140015aa6d48cb43:_fb59a0b931a1b7e2e5f72b0a917f0c@primary.liff-db--q4wt5c4d9mvq.addon.code.run:28996/_83707e411701?sslmode=require" \
  --env REDIS_URL="rediss://default:808027dc8dbb883958e01a0cd3366578@master.liff-cache--q4wt5c4d9mvq.addon.code.run:6379" \
  --env REDIS_TLS=true \
  --env REDIS_SNI="master.liff-cache--q4wt5c4d9mvq.addon.code.run" \
  --env LIFF_ID="$LIFF_ID" \
  --secret JWT_SECRET=jwt-secret \
  --secret LINE_CHANNEL_SECRET=line-channel-secret \
  --secret GEMINI_API_KEY=gemini-api-key

# Get backend URL
BACKEND_URL=$(northflank service url tree-bank-backend)
echo "Backend URL: $BACKEND_URL"

echo -e "${GREEN}✓ Backend deployed${NC}"
echo ""

echo -e "${BLUE}Step 5: Deploying frontend...${NC}"

cd ../src/line

# Deploy frontend
northflank service create \
  --name tree-bank-frontend \
  --project "$PROJECT_NAME" \
  --dockerfile Dockerfile \
  --context . \
  --port 80 \
  --build-arg VITE_LIFF_ID="$LIFF_ID" \
  --build-arg VITE_API_URL="$BACKEND_URL" \
  --secret VITE_GEMINI_API_KEY=gemini-api-key

# Get frontend URL
FRONTEND_URL=$(northflank service url tree-bank-frontend)
echo "Frontend URL: $FRONTEND_URL"

echo -e "${GREEN}✓ Frontend deployed${NC}"
echo ""

echo -e "${BLUE}Step 6: Updating backend CORS...${NC}"

# Update backend with frontend URL
northflank service env set tree-bank-backend FRONTEND_URL="$FRONTEND_URL"

echo -e "${GREEN}✓ CORS updated${NC}"
echo ""

echo ""
echo "============================================"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "============================================"
echo ""
echo "📱 Frontend URL: $FRONTEND_URL"
echo "🔧 Backend URL:  $BACKEND_URL"
echo "🔗 LIFF URL:     https://liff.line.me/$LIFF_ID"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: Update LIFF Endpoint URL${NC}"
echo "1. Go to: https://developers.line.biz/console/"
echo "2. Select LIFF app ID: $LIFF_ID"
echo "3. Update Endpoint URL to: $FRONTEND_URL"
echo "4. Save changes"
echo ""
echo "✅ Then test: https://liff.line.me/$LIFF_ID"
echo ""
echo -e "${GREEN}🌳 Happy deploying!${NC}"
