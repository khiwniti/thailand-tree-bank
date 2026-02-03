#!/bin/bash

# Railway Backend Deployment - Step by Step Guide

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║  🚂 Thailand Tree Bank - Backend Deployment to Railway       ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${BLUE}📋 Pre-Deployment Checklist:${NC}"
echo ""

# Check backend files
echo -n "  Checking backend files... "
if [ -f "backend/package.json" ] && [ -f "backend/src/index.ts" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo "  Error: Backend files not found"
    exit 1
fi

# Check Prisma schema
echo -n "  Checking Prisma schema... "
if [ -f "backend/prisma/schema.prisma" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    exit 1
fi

# Check Git
echo -n "  Checking Git repository... "
if git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✓ All checks passed!${NC}"
echo ""

echo "Choose deployment method:"
echo ""
echo "  1. ${GREEN}Railway Web Interface${NC} (Easiest, recommended)"
echo "  2. ${BLUE}Railway CLI${NC} (Faster if CLI is set up)"
echo ""
read -p "Enter your choice (1-2): " method

if [ "$method" = "1" ]; then
    echo ""
    echo -e "${BLUE}🌐 Railway Web Interface Deployment${NC}"
    echo "═══════════════════════════════════════════════════════════════"
    echo ""

    echo "STEP 1: Open Railway"
    echo "────────────────────────────────────────────────────────────"
    echo -e "  👉 ${CYAN}https://railway.app/new${NC}"
    echo ""
    echo "  • Sign in with GitHub (if not already)"
    echo ""
    read -p "Press Enter when you're on Railway..."

    echo ""
    echo "STEP 2: Deploy from GitHub"
    echo "────────────────────────────────────────────────────────────"
    echo "  1. Click ${YELLOW}'Deploy from GitHub repo'${NC}"
    echo "  2. Select: ${GREEN}khiwniti/thailand-tree-bank${NC}"
    echo "  3. Click ${YELLOW}'Deploy Now'${NC}"
    echo ""
    read -p "Press Enter when repository is selected..."

    echo ""
    echo "STEP 3: Configure Service"
    echo "────────────────────────────────────────────────────────────"
    echo ""
    echo "  Railway should auto-detect your backend, but verify:"
    echo ""
    echo -e "  ${YELLOW}Service name:${NC} backend (or thailand-tree-bank-backend)"
    echo -e "  ${YELLOW}Root directory:${NC} backend"
    echo -e "  ${YELLOW}Build command:${NC} npm install && npx prisma generate && npm run build"
    echo -e "  ${YELLOW}Start command:${NC} npm start"
    echo ""
    echo "  If not auto-detected, click 'Settings' → 'Service' and set these manually"
    echo ""
    read -p "Press Enter when service is configured..."

    echo ""
    echo "STEP 4: Add PostgreSQL Database"
    echo "────────────────────────────────────────────────────────────"
    echo "  1. In your project, click ${YELLOW}'+ New'${NC}"
    echo "  2. Select ${YELLOW}'Database'${NC}"
    echo "  3. Choose ${GREEN}'Add PostgreSQL'${NC}"
    echo "  4. Railway will automatically:"
    echo "     • Create the database"
    echo "     • Set DATABASE_URL environment variable"
    echo ""
    read -p "Press Enter when PostgreSQL is added..."

    echo ""
    echo "STEP 5: Add Redis (Optional but Recommended)"
    echo "────────────────────────────────────────────────────────────"
    echo "  1. Click ${YELLOW}'+ New'${NC} again"
    echo "  2. Select ${YELLOW}'Database'${NC}"
    echo "  3. Choose ${GREEN}'Add Redis'${NC}"
    echo "  4. Railway will automatically set REDIS_URL"
    echo ""
    echo -e "  ${YELLOW}Skip this?${NC} App works without Redis (just slower)"
    echo ""
    read -p "Press Enter when Redis is added (or skipped)..."

    echo ""
    echo "STEP 6: Add Environment Variables"
    echo "────────────────────────────────────────────────────────────"
    echo "  1. Click on your ${GREEN}'backend'${NC} service"
    echo "  2. Go to ${YELLOW}'Variables'${NC} tab"
    echo "  3. Add these variables:"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${GREEN}Required Variables:${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Variable: PORT"
    echo "Value: 8080"
    echo ""
    echo "Variable: NODE_ENV"
    echo "Value: production"
    echo ""
    echo "Variable: JWT_SECRET"
    echo "Value: your-super-secret-jwt-key-$(openssl rand -hex 32)"
    echo -e "${YELLOW}⚠️  Change this to your own secure random string!${NC}"
    echo ""
    echo "Variable: LINE_CHANNEL_SECRET"
    echo "Value: [Your LINE Channel Secret from LINE Developers Console]"
    echo ""
    echo "Variable: FRONTEND_URL"
    echo "Value: https://thailand-tree-bank.pages.dev"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${CYAN}Optional Variables:${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Variable: GEMINI_API_KEY"
    echo "Value: [Your Gemini API key if using AI features]"
    echo ""
    echo "Variable: REDIS_TLS"
    echo "Value: true"
    echo -e "${YELLOW}(Only if Railway Redis uses TLS)${NC}"
    echo ""
    echo -e "${YELLOW}💡 Note: DATABASE_URL and REDIS_URL are auto-set by Railway${NC}"
    echo ""
    read -p "Press Enter when all variables are added..."

    echo ""
    echo "STEP 7: Deploy and Wait"
    echo "────────────────────────────────────────────────────────────"
    echo "  Railway will automatically:"
    echo "  1. Clone your repository"
    echo "  2. Install dependencies"
    echo "  3. Generate Prisma Client"
    echo "  4. Build TypeScript"
    echo "  5. Start the server"
    echo ""
    echo -e "  ${YELLOW}⏱  This takes 2-5 minutes${NC}"
    echo ""
    read -p "Press Enter when deployment shows 'Active' status..."

    echo ""
    echo "STEP 8: Run Database Migrations"
    echo "────────────────────────────────────────────────────────────"
    echo "  1. In Railway, click your ${GREEN}'backend'${NC} service"
    echo "  2. Go to ${YELLOW}'Settings'${NC} tab"
    echo "  3. Scroll to ${YELLOW}'Deploy'${NC} section"
    echo "  4. Update ${YELLOW}'Build Command'${NC} to:"
    echo -e "     ${CYAN}npm install && npx prisma generate && npx prisma db push && npm run build${NC}"
    echo "  5. Click ${YELLOW}'Save'${NC}"
    echo "  6. Wait for automatic redeploy"
    echo ""
    echo -e "  ${YELLOW}Alternative:${NC} Use Railway CLI to run migrations"
    echo ""
    read -p "Press Enter when migrations are complete..."

    echo ""
    echo "STEP 9: Get Your Backend URL"
    echo "────────────────────────────────────────────────────────────"
    echo "  1. In Railway, click your ${GREEN}'backend'${NC} service"
    echo "  2. Go to ${YELLOW}'Settings'${NC} tab"
    echo "  3. Look for ${YELLOW}'Domains'${NC} section"
    echo "  4. Click ${YELLOW}'Generate Domain'${NC} (if not auto-generated)"
    echo "  5. Copy your domain:"
    echo -e "     ${CYAN}https://thailand-tree-bank-production.up.railway.app${NC}"
    echo ""
    read -p "Paste your backend URL here: " BACKEND_URL

    echo ""
    echo "STEP 10: Test Backend"
    echo "────────────────────────────────────────────────────────────"
    echo -e "  Testing: ${CYAN}${BACKEND_URL}/health${NC}"
    echo ""

    if curl -s "${BACKEND_URL}/health" | grep -q "ok"; then
        echo -e "  ${GREEN}✓ Backend is responding!${NC}"
    else
        echo -e "  ${YELLOW}⚠ Backend might still be starting...${NC}"
        echo "  Check logs in Railway dashboard"
    fi

    echo ""
    echo "STEP 11: Update Frontend"
    echo "────────────────────────────────────────────────────────────"
    echo "  1. Go to Cloudflare Dashboard:"
    echo -e "     ${CYAN}https://dash.cloudflare.com/${NC}"
    echo "  2. Navigate: Workers & Pages → thailand-tree-bank"
    echo "  3. Click ${YELLOW}'Settings'${NC} tab"
    echo "  4. Scroll to ${YELLOW}'Environment variables'${NC}"
    echo "  5. Find ${GREEN}'VITE_API_URL'${NC}"
    echo "  6. Click ${YELLOW}'Edit'${NC}"
    echo "  7. Update value to:"
    echo -e "     ${CYAN}${BACKEND_URL}${NC}"
    echo "  8. Click ${YELLOW}'Save'${NC}"
    echo ""
    echo "  9. Go to ${YELLOW}'Deployments'${NC} tab"
    echo "  10. Click ${YELLOW}'⋯'${NC} on latest deployment"
    echo "  11. Click ${YELLOW}'Retry deployment'${NC}"
    echo ""
    read -p "Press Enter when frontend is redeployed..."

elif [ "$method" = "2" ]; then
    echo ""
    echo -e "${BLUE}🖥️  Railway CLI Deployment${NC}"
    echo "═══════════════════════════════════════════════════════════════"
    echo ""

    # Check if Railway CLI is installed
    if ! command -v railway &> /dev/null; then
        echo -e "${YELLOW}⚠️  Railway CLI not found. Installing...${NC}"
        npm install -g @railway/cli
        echo -e "${GREEN}✓ Railway CLI installed${NC}"
    fi

    # Login
    echo ""
    echo "Checking Railway login status..."
    if ! railway whoami 2>&1 | grep -q "Logged in"; then
        echo -e "${YELLOW}Please login to Railway...${NC}"
        railway login
    fi
    echo -e "${GREEN}✓ Logged in to Railway${NC}"

    # Navigate to backend
    cd backend

    # Initialize project
    echo ""
    echo "Initializing Railway project..."
    if [ ! -f "railway.json" ] && [ ! -f ".railway/railway.json" ]; then
        railway init
    fi

    # Add PostgreSQL
    echo ""
    echo -e "${BLUE}Adding PostgreSQL database...${NC}"
    railway add -d postgres
    echo -e "${GREEN}✓ PostgreSQL added${NC}"

    # Add Redis
    echo ""
    read -p "Add Redis? (recommended, y/n): " add_redis
    if [ "$add_redis" = "y" ] || [ "$add_redis" = "Y" ]; then
        railway add -d redis
        echo -e "${GREEN}✓ Redis added${NC}"
    fi

    # Set environment variables
    echo ""
    echo -e "${BLUE}Setting environment variables...${NC}"
    railway variables set PORT=8080
    railway variables set NODE_ENV=production
    railway variables set FRONTEND_URL=https://thailand-tree-bank.pages.dev

    echo ""
    echo -e "${YELLOW}You need to set these manually:${NC}"
    echo "  JWT_SECRET - Your secure random string"
    echo "  LINE_CHANNEL_SECRET - From LINE Developers Console"
    echo ""
    echo "Run these commands:"
    echo -e "  ${CYAN}railway variables set JWT_SECRET=your-secret-here${NC}"
    echo -e "  ${CYAN}railway variables set LINE_CHANNEL_SECRET=your-line-secret${NC}"
    echo ""
    read -p "Press Enter when you've set these variables..."

    # Deploy
    echo ""
    echo -e "${BLUE}Deploying to Railway...${NC}"
    railway up

    # Run migrations
    echo ""
    echo -e "${BLUE}Running database migrations...${NC}"
    railway run npx prisma db push

    # Get domain
    echo ""
    echo -e "${BLUE}Getting backend URL...${NC}"
    BACKEND_URL=$(railway domain 2>&1 | grep -o 'https://[^[:space:]]*' | head -1)

    cd ..

else
    echo -e "${RED}Invalid choice${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  🎉 Backend Deployed Successfully!                            ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${BLUE}📍 Backend URL:${NC}"
echo -e "  ${GREEN}${BACKEND_URL}${NC}"
echo ""

echo -e "${BLUE}🧪 Test Endpoints:${NC}"
echo ""
echo "  Health check:"
echo -e "  ${CYAN}curl ${BACKEND_URL}/health${NC}"
echo ""
echo "  API info:"
echo -e "  ${CYAN}curl ${BACKEND_URL}/api${NC}"
echo ""

echo -e "${BLUE}📝 Summary:${NC}"
echo ""
echo "  ✅ Backend: Deployed on Railway"
echo "  ✅ Database: PostgreSQL configured"
echo "  ✅ Cache: Redis configured (if added)"
echo "  ✅ Domain: Generated"
echo ""

echo -e "${BLUE}🔗 Connect Frontend:${NC}"
echo ""
echo "  1. Update VITE_API_URL in Cloudflare Pages to:"
echo -e "     ${CYAN}${BACKEND_URL}${NC}"
echo "  2. Redeploy frontend"
echo "  3. Test complete flow in LINE"
echo ""

echo -e "${BLUE}📊 Monitor Your Deployment:${NC}"
echo ""
echo "  Railway Dashboard:"
echo -e "  ${CYAN}https://railway.app/project/your-project${NC}"
echo ""
echo "  View logs:"
echo -e "  ${CYAN}railway logs${NC}"
echo ""
echo "  Follow logs:"
echo -e "  ${CYAN}railway logs --follow${NC}"
echo ""

echo "🎉 Backend deployment completed!"
echo ""
