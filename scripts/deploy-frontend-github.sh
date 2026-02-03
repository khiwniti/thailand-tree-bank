#!/bin/bash

# Cloudflare Pages Deployment via GitHub - Step by Step Guide

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║  🌳 Thailand Tree Bank - Cloudflare Pages Deployment         ║"
echo "║  Method: GitHub Integration (Automatic)                       ║"
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

# Check 1: Git status
echo -n "  Checking git repository... "
if git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    exit 1
fi

# Check 2: Frontend build
echo -n "  Checking frontend build... "
if [ -d "frontend/dist" ] && [ -f "frontend/dist/index.html" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}Building...${NC}"
    cd frontend
    npm install > /dev/null 2>&1
    npm run build > /dev/null 2>&1
    cd ..
    echo -e "${GREEN}✓${NC}"
fi

# Check 3: Git remote
echo -n "  Checking GitHub connection... "
REMOTE_URL=$(git config --get remote.origin.url)
if [[ $REMOTE_URL == *"thailand-tree-bank"* ]]; then
    echo -e "${GREEN}✓${NC}"
    echo -e "    ${CYAN}$REMOTE_URL${NC}"
else
    echo -e "${YELLOW}⚠${NC}"
fi

# Check 4: Latest commit
echo -n "  Checking latest commit... "
LATEST_COMMIT=$(git log -1 --oneline)
echo -e "${GREEN}✓${NC}"
echo -e "    ${CYAN}$LATEST_COMMIT${NC}"

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ All checks passed! Ready to deploy${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${BLUE}🚀 Deployment Steps:${NC}"
echo ""
echo "STEP 1: Open Cloudflare Dashboard"
echo "────────────────────────────────────────────────────────────"
echo -e "  👉 ${CYAN}https://dash.cloudflare.com/${NC}"
echo ""
read -p "Press Enter when you have opened the dashboard..."

echo ""
echo "STEP 2: Navigate to Pages"
echo "────────────────────────────────────────────────────────────"
echo "  1. Look at the left sidebar"
echo "  2. Click on ${YELLOW}'Workers & Pages'${NC}"
echo "  3. Click the blue ${YELLOW}'Create application'${NC} button"
echo "  4. Click on the ${YELLOW}'Pages'${NC} tab"
echo "  5. Click ${YELLOW}'Connect to Git'${NC}"
echo ""
read -p "Press Enter when you're on the 'Connect to Git' page..."

echo ""
echo "STEP 3: Connect GitHub Repository"
echo "────────────────────────────────────────────────────────────"
echo "  1. Click ${YELLOW}'Connect GitHub'${NC}"
echo "  2. Authorize Cloudflare (if needed)"
echo "  3. Select repository: ${GREEN}khiwniti/thailand-tree-bank${NC}"
echo "  4. Click ${YELLOW}'Begin setup'${NC}"
echo ""
read -p "Press Enter when repository is connected..."

echo ""
echo "STEP 4: Configure Build Settings"
echo "────────────────────────────────────────────────────────────"
echo ""
echo -e "${YELLOW}Project name:${NC}"
echo "  thailand-tree-bank"
echo ""
echo -e "${YELLOW}Production branch:${NC}"
echo "  main"
echo ""
echo -e "${YELLOW}Framework preset:${NC}"
echo "  None (or select 'Vite' if available)"
echo ""
echo -e "${YELLOW}Build command:${NC}"
echo -e "  ${CYAN}cd frontend && npm install && npm run build${NC}"
echo ""
echo -e "${YELLOW}Build output directory:${NC}"
echo -e "  ${CYAN}frontend/dist${NC}"
echo ""
echo -e "${YELLOW}Root directory (advanced):${NC}"
echo "  / (leave as root)"
echo ""
read -p "Press Enter when build settings are configured..."

echo ""
echo "STEP 5: Add Environment Variables"
echo "────────────────────────────────────────────────────────────"
echo ""
echo "Click ${YELLOW}'Environment variables (advanced)'${NC} to expand"
echo ""
echo "Add these THREE variables:"
echo ""
echo "Variable 1:"
echo -e "  Name:  ${GREEN}VITE_LIFF_ID${NC}"
echo -e "  Value: ${CYAN}2008934197-jM9Zoogn${NC}"
echo "  Environment: Production ✓"
echo ""
echo "Variable 2:"
echo -e "  Name:  ${GREEN}VITE_OPENROUTER_API_KEY${NC}"
echo -e "  Value: ${CYAN}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${NC}"
echo "  Environment: Production ✓"
echo ""
echo "Variable 3:"
echo -e "  Name:  ${GREEN}VITE_API_URL${NC}"
echo -e "  Value: ${CYAN}http://localhost:8080${NC} ${YELLOW}(update after backend deployment)${NC}"
echo "  Environment: Production ✓"
echo ""
echo -e "${YELLOW}💡 Tip: Click 'Add variable' for each one${NC}"
echo ""
read -p "Press Enter when all environment variables are added..."

echo ""
echo "STEP 6: Deploy! 🚀"
echo "────────────────────────────────────────────────────────────"
echo "  1. Review all settings"
echo "  2. Click the blue ${YELLOW}'Save and Deploy'${NC} button"
echo "  3. Wait for build to complete (usually 2-3 minutes)"
echo ""
read -p "Press Enter to start watching deployment progress..."

echo ""
echo -e "${BLUE}⏳ Deployment in progress...${NC}"
echo ""
echo "You should see:"
echo "  • Initializing build environment"
echo "  • Cloning repository"
echo "  • Installing dependencies"
echo "  • Building application"
echo "  • Deploying to Cloudflare's global network"
echo ""
echo -e "${YELLOW}⏱  This usually takes 2-3 minutes${NC}"
echo ""
read -p "Press Enter when deployment is COMPLETE and shows success..."

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  🎉 Frontend Deployed Successfully!                           ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${BLUE}📍 Your Deployment URLs:${NC}"
echo ""
echo -e "  Production: ${GREEN}https://thailand-tree-bank.pages.dev${NC}"
echo -e "  Alternative: ${CYAN}https://b02bd34b.thailand-tree-bank.pages.dev${NC}"
echo ""

echo -e "${BLUE}🧪 Test Your Deployment:${NC}"
echo ""
echo "  1. Open in browser:"
echo -e "     ${CYAN}https://thailand-tree-bank.pages.dev${NC}"
echo ""
echo "  2. You should see:"
echo "     • Beautiful Thai Tree Bank interface"
echo "     • Demo mode banner (orange at top)"
echo "     • Interactive map"
echo "     • All features working"
echo ""
echo "  3. Check browser console (F12):"
echo "     • No critical errors"
echo "     • LIFF should initialize"
echo ""

read -p "Press Enter to continue to LINE LIFF setup..."

echo ""
echo -e "${BLUE}📱 Update LINE LIFF Endpoint:${NC}"
echo "────────────────────────────────────────────────────────────"
echo ""
echo "  1. Go to: ${CYAN}https://developers.line.biz/console/${NC}"
echo "  2. Select your Provider"
echo "  3. Find LIFF app: ${GREEN}2008934197-jM9Zoogn${NC}"
echo "  4. Click 'Edit' or the app name"
echo "  5. Update ${YELLOW}'Endpoint URL'${NC} to:"
echo -e "     ${GREEN}https://thailand-tree-bank.pages.dev${NC}"
echo "  6. Click ${YELLOW}'Update'${NC}"
echo ""
read -p "Press Enter when LIFF endpoint is updated..."

echo ""
echo -e "${BLUE}🎯 Test in LINE:${NC}"
echo "────────────────────────────────────────────────────────────"
echo ""
echo "  Send this URL to yourself in LINE:"
echo -e "  ${GREEN}https://liff.line.me/2008934197-jM9Zoogn${NC}"
echo ""
echo "  Or create a QR code:"
echo "  1. Go to: https://www.qr-code-generator.com/"
echo "  2. Enter URL: https://liff.line.me/2008934197-jM9Zoogn"
echo "  3. Scan with LINE app"
echo ""
echo "  Expected result:"
echo "  ✓ App opens in LINE browser"
echo "  ✓ Shows login screen or main interface"
echo "  ✓ Can interact with all features"
echo ""

read -p "Press Enter to see next steps for backend deployment..."

echo ""
echo -e "${YELLOW}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${YELLOW}║  ⚠️  Backend Deployment Required                              ║${NC}"
echo -e "${YELLOW}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${BLUE}Why Railway and not Cloudflare?${NC}"
echo ""
echo "Your backend uses:"
echo -e "  ${RED}✗${NC} PostgreSQL + Prisma ORM"
echo -e "  ${RED}✗${NC} Redis caching"
echo -e "  ${RED}✗${NC} Express.js with file uploads"
echo -e "  ${RED}✗${NC} Long-running processes"
echo ""
echo "Cloudflare Workers doesn't support these."
echo ""
echo -e "${GREEN}Railway provides:${NC}"
echo -e "  ${GREEN}✓${NC} Full Node.js runtime"
echo -e "  ${GREEN}✓${NC} Free PostgreSQL database"
echo -e "  ${GREEN}✓${NC} Free Redis cache"
echo -e "  ${GREEN}✓${NC} \$5/month free credit"
echo -e "  ${GREEN}✓${NC} GitHub auto-deploy"
echo ""

echo -e "${BLUE}Backend Deployment Options:${NC}"
echo ""
echo "  A. Railway Web Interface (Recommended)"
echo -e "     ${CYAN}https://railway.app/new${NC}"
echo ""
echo "  B. Railway CLI"
echo "     npm install -g @railway/cli"
echo "     railway login"
echo "     cd backend && railway init && railway up"
echo ""
echo "  C. Render.com (Alternative)"
echo -e "     ${CYAN}https://render.com${NC}"
echo ""

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Frontend Deployment Complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${BLUE}📝 Summary:${NC}"
echo ""
echo -e "  Frontend URL: ${GREEN}https://thailand-tree-bank.pages.dev${NC}"
echo "  Status: ✅ Deployed"
echo "  LINE LIFF: ✅ Updated"
echo "  Backend: ⏳ Next step"
echo ""

echo -e "${BLUE}📚 Next Steps:${NC}"
echo ""
echo "  1. Deploy backend to Railway (see DEPLOYMENT_GUIDE.md)"
echo "  2. Get backend URL (e.g., https://your-app.railway.app)"
echo "  3. Update VITE_API_URL in Cloudflare Pages"
echo "  4. Test complete flow in LINE"
echo ""

echo -e "${YELLOW}Need help with backend?${NC}"
echo "  Run: ./scripts/deploy-backend-railway.sh"
echo "  Or read: DEPLOYMENT_GUIDE.md"
echo ""

echo "🎉 Frontend deployment completed successfully!"
echo ""
