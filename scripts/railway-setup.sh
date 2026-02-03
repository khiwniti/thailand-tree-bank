#!/bin/bash

# Thailand Tree Bank - Railway Automated Setup Script
# This script configures Railway services with required environment variables

set -e

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║     🚂 Thailand Tree Bank - Railway Auto-Setup                   ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Generate JWT Secret
echo "🔑 Generating JWT Secret..."
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
echo -e "${GREEN}✓ JWT Secret generated${NC}"
echo ""

# Prompt for required credentials
echo "📝 Please provide the following credentials:"
echo ""

read -p "LINE_CHANNEL_SECRET (from LINE Developers Console): " LINE_CHANNEL_SECRET
read -p "VITE_LIFF_ID (from LINE Developers Console): " VITE_LIFF_ID

echo ""
echo "📝 Optional AI API keys (press Enter to skip):"
read -p "GEMINI_API_KEY (optional): " GEMINI_API_KEY
read -p "VITE_OPENROUTER_API_KEY (optional): " VITE_OPENROUTER_API_KEY

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 Configuring Backend Service..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd /home/user/line-liff-v2-starter/backend

# Set backend variables
echo "Setting JWT_SECRET..."
railway variables --set JWT_SECRET="$JWT_SECRET"

echo "Setting LINE_CHANNEL_SECRET..."
railway variables --set LINE_CHANNEL_SECRET="$LINE_CHANNEL_SECRET"

echo "Setting NODE_ENV..."
railway variables --set NODE_ENV="production"

if [ -n "$GEMINI_API_KEY" ]; then
    echo "Setting GEMINI_API_KEY..."
    railway variables --set GEMINI_API_KEY="$GEMINI_API_KEY"
fi

echo -e "${GREEN}✓ Backend variables configured${NC}"
echo ""

# Generate backend domain
echo "🌐 Generating backend domain..."
BACKEND_DOMAIN=$(railway domain 2>&1 | grep -o 'https://[^[:space:]]*' | head -1)

if [ -z "$BACKEND_DOMAIN" ]; then
    echo -e "${YELLOW}⚠ Could not auto-generate domain. Please generate manually via dashboard.${NC}"
    BACKEND_DOMAIN="https://thailand-tree-bank-backend-production.up.railway.app"
fi

echo -e "${GREEN}✓ Backend domain: $BACKEND_DOMAIN${NC}"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 Configuring Frontend Service..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd /home/user/line-liff-v2-starter/frontend

# Set frontend variables
echo "Setting VITE_LIFF_ID..."
railway variables --set VITE_LIFF_ID="$VITE_LIFF_ID" --service thailand-tree-bank-frontend

echo "Setting VITE_API_URL..."
railway variables --set VITE_API_URL="$BACKEND_DOMAIN" --service thailand-tree-bank-frontend

if [ -n "$VITE_OPENROUTER_API_KEY" ]; then
    echo "Setting VITE_OPENROUTER_API_KEY..."
    railway variables --set VITE_OPENROUTER_API_KEY="$VITE_OPENROUTER_API_KEY" --service thailand-tree-bank-frontend
fi

if [ -n "$GEMINI_API_KEY" ]; then
    echo "Setting VITE_GEMINI_API_KEY..."
    railway variables --set VITE_GEMINI_API_KEY="$GEMINI_API_KEY" --service thailand-tree-bank-frontend
fi

echo -e "${GREEN}✓ Frontend variables configured${NC}"
echo ""

# Generate frontend domain
echo "🌐 Generating frontend domain..."
FRONTEND_DOMAIN=$(railway domain --service thailand-tree-bank-frontend 2>&1 | grep -o 'https://[^[:space:]]*' | head -1)

if [ -z "$FRONTEND_DOMAIN" ]; then
    echo -e "${YELLOW}⚠ Could not auto-generate domain. Please generate manually via dashboard.${NC}"
    FRONTEND_DOMAIN="https://thailand-tree-bank-frontend-production.up.railway.app"
fi

echo -e "${GREEN}✓ Frontend domain: $FRONTEND_DOMAIN${NC}"
echo ""

# Update backend with frontend URL for CORS
echo "🔄 Updating backend CORS settings..."
cd /home/user/line-liff-v2-starter/backend
railway variables --set FRONTEND_URL="$FRONTEND_DOMAIN"

echo -e "${GREEN}✓ CORS configured${NC}"
echo ""

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                    ✅ CONFIGURATION COMPLETE!                    ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Summary:"
echo "  Backend:  $BACKEND_DOMAIN"
echo "  Frontend: $FRONTEND_DOMAIN"
echo ""
echo "🚀 Next Steps:"
echo "  1. Railway will auto-redeploy with new variables"
echo "  2. Wait ~2 minutes for builds to complete"
echo "  3. Check status: railway service status --all"
echo "  4. Test backend: curl $BACKEND_DOMAIN/health"
echo "  5. Open frontend: $FRONTEND_DOMAIN"
echo ""
echo "📝 Important:"
echo "  Update your LIFF app Endpoint URL to: $FRONTEND_DOMAIN"
echo "  LINE Developers Console: https://developers.line.biz/console/"
echo ""
echo "🎉 Your Thailand Tree Bank is deploying!"
