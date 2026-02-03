#!/bin/bash

# Master Deployment Script - Complete Deployment Wizard

clear

cat << "EOF"
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║   🌳  THAILAND TREE BANK - DEPLOYMENT WIZARD  🌳                  ║
║                                                                   ║
║   Complete deployment automation for frontend and backend        ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
EOF

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}                    DEPLOYMENT OPTIONS                         ${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${GREEN}1.${NC} ${CYAN}Deploy Frontend Only${NC} (Cloudflare Pages)"
echo "   • Quick 5-minute setup"
echo "   • GitHub integration (automatic updates)"
echo "   • Global CDN included"
echo "   • FREE forever"
echo ""

echo -e "${GREEN}2.${NC} ${CYAN}Deploy Backend Only${NC} (Railway)"
echo "   • PostgreSQL + Redis included"
echo "   • 10-minute setup"
echo "   • \$5/month free credit"
echo "   • Automatic deployments"
echo ""

echo -e "${GREEN}3.${NC} ${MAGENTA}Deploy Both (Complete Setup)${NC} ${YELLOW}← Recommended${NC}"
echo "   • Full stack deployment"
echo "   • ~15-20 minutes"
echo "   • Production-ready"
echo "   • Integrated frontend + backend"
echo ""

echo -e "${GREEN}4.${NC} ${BLUE}Check Deployment Status${NC}"
echo "   • Verify existing deployments"
echo "   • Test endpoints"
echo "   • View configuration"
echo ""

echo -e "${GREEN}5.${NC} ${BLUE}View Documentation${NC}"
echo "   • Read deployment guides"
echo "   • Troubleshooting help"
echo "   • Environment variables reference"
echo ""

echo -e "${RED}0.${NC} Exit"
echo ""

read -p "$(echo -e ${YELLOW}Enter your choice [0-5]:${NC} )" choice

case $choice in
    1)
        clear
        echo ""
        echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║  🚀 Frontend Deployment - Cloudflare Pages                   ║${NC}"
        echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}"
        echo ""

        # Check if build exists
        if [ ! -d "frontend/dist" ]; then
            echo -e "${YELLOW}⚙️  Building frontend...${NC}"
            cd frontend
            npm install
            npm run build
            cd ..
            echo -e "${GREEN}✓ Build complete${NC}"
            echo ""
        fi

        echo -e "${CYAN}Starting frontend deployment wizard...${NC}"
        echo ""
        ./scripts/deploy-frontend-github.sh
        ;;

    2)
        clear
        echo ""
        echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║  🚂 Backend Deployment - Railway                             ║${NC}"
        echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}"
        echo ""

        echo -e "${CYAN}Starting backend deployment wizard...${NC}"
        echo ""
        ./scripts/deploy-backend-railway.sh
        ;;

    3)
        clear
        echo ""
        echo -e "${MAGENTA}╔═══════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${MAGENTA}║  🎯 Complete Deployment - Frontend + Backend                 ║${NC}"
        echo -e "${MAGENTA}╚═══════════════════════════════════════════════════════════════╝${NC}"
        echo ""

        echo -e "${BLUE}This will deploy both frontend and backend in sequence.${NC}"
        echo ""
        echo -e "${YELLOW}Estimated time: 15-20 minutes${NC}"
        echo ""
        read -p "Continue? (y/n): " continue_deploy

        if [ "$continue_deploy" != "y" ] && [ "$continue_deploy" != "Y" ]; then
            echo "Deployment cancelled."
            exit 0
        fi

        # Step 1: Frontend
        echo ""
        echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
        echo -e "${GREEN}STEP 1 of 2: Frontend Deployment${NC}"
        echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
        echo ""

        ./scripts/deploy-frontend-github.sh

        echo ""
        read -p "Press Enter to continue to backend deployment..."

        # Step 2: Backend
        clear
        echo ""
        echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
        echo -e "${GREEN}STEP 2 of 2: Backend Deployment${NC}"
        echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
        echo ""

        ./scripts/deploy-backend-railway.sh

        # Final summary
        clear
        echo ""
        echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║  🎉 COMPLETE DEPLOYMENT FINISHED!                             ║${NC}"
        echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}"
        echo ""

        echo -e "${BLUE}📍 Your Deployment:${NC}"
        echo ""
        echo -e "  Frontend: ${GREEN}https://thailand-tree-bank.pages.dev${NC}"
        echo -e "  Backend:  ${GREEN}[Your Railway URL]${NC}"
        echo ""

        echo -e "${BLUE}🎯 Next Steps:${NC}"
        echo ""
        echo "  1. Update VITE_API_URL in Cloudflare with backend URL"
        echo "  2. Redeploy frontend"
        echo "  3. Test in LINE: https://liff.line.me/2008934197-jM9Zoogn"
        echo ""

        echo -e "${CYAN}📱 Test Your App:${NC}"
        echo "  • Open in browser: https://thailand-tree-bank.pages.dev"
        echo "  • Send LINE URL to yourself"
        echo "  • Verify all features work"
        echo ""
        ;;

    4)
        clear
        echo ""
        echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${BLUE}║  📊 Deployment Status Check                                   ║${NC}"
        echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"
        echo ""

        echo -e "${YELLOW}Checking deployments...${NC}"
        echo ""

        # Frontend check
        echo -e "${CYAN}Frontend (Cloudflare Pages):${NC}"
        FRONTEND_URL="https://thailand-tree-bank.pages.dev"
        echo -n "  Testing $FRONTEND_URL... "

        if curl -sI "$FRONTEND_URL" 2>/dev/null | head -n 1 | grep -q "200\|301\|302"; then
            echo -e "${GREEN}✓ Online${NC}"
            echo "  Status: Deployed and accessible"
        else
            echo -e "${YELLOW}⚠ Not accessible${NC}"
            echo "  Status: Not deployed or configuration needed"
        fi

        echo ""

        # Backend check
        echo -e "${CYAN}Backend (Railway):${NC}"
        echo "  Visit Railway dashboard to check backend status:"
        echo "  https://railway.app/"
        echo ""

        # Git status
        echo -e "${CYAN}Repository Status:${NC}"
        echo -n "  Current branch: "
        git branch --show-current
        echo -n "  Latest commit: "
        git log -1 --oneline
        echo -n "  Remote status: "
        git status | grep "Your branch" | head -1
        echo ""

        # Files check
        echo -e "${CYAN}Build Status:${NC}"
        if [ -d "frontend/dist" ]; then
            echo -e "  Frontend build: ${GREEN}✓ Ready${NC}"
            echo "    Location: frontend/dist/"
            du -sh frontend/dist/ | awk '{print "    Size: " $1}'
        else
            echo -e "  Frontend build: ${YELLOW}⚠ Not built${NC}"
            echo "    Run: cd frontend && npm run build"
        fi
        echo ""

        # Env vars check
        echo -e "${CYAN}Configuration:${NC}"
        if [ -f "frontend/.env.local" ]; then
            echo -e "  Frontend env: ${GREEN}✓ Configured${NC}"
            echo "    File: frontend/.env.local"
        else
            echo -e "  Frontend env: ${YELLOW}⚠ Not configured${NC}"
        fi

        if [ -f "backend/.env" ]; then
            echo -e "  Backend env: ${GREEN}✓ Configured${NC}"
            echo "    File: backend/.env"
        else
            echo -e "  Backend env: ${YELLOW}⚠ Not configured${NC}"
        fi
        echo ""
        ;;

    5)
        clear
        echo ""
        echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${BLUE}║  📚 Documentation                                             ║${NC}"
        echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"
        echo ""

        echo "Available documentation:"
        echo ""
        echo -e "  ${GREEN}1.${NC} DEPLOY_NOW.md          - Quick deployment guide"
        echo -e "  ${GREEN}2.${NC} DEPLOYMENT_GUIDE.md    - Complete reference"
        echo -e "  ${GREEN}3.${NC} QUICK_FIX.md           - Troubleshooting"
        echo -e "  ${GREEN}4.${NC} CLOUDFLARE_SETUP.md    - Environment variables"
        echo -e "  ${GREEN}5.${NC} README.md              - Project overview"
        echo ""

        read -p "Enter number to view (or 0 to skip): " doc_choice

        case $doc_choice in
            1) less DEPLOY_NOW.md ;;
            2) less DEPLOYMENT_GUIDE.md ;;
            3) less QUICK_FIX.md ;;
            4) less CLOUDFLARE_SETUP.md ;;
            5) less README.md ;;
            *) echo "Skipped." ;;
        esac
        ;;

    0)
        echo ""
        echo "Goodbye! 👋"
        echo ""
        exit 0
        ;;

    *)
        echo ""
        echo -e "${RED}Invalid choice. Please run the script again.${NC}"
        echo ""
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}Need more help?${NC}"
echo -e "  • View guides: cat DEPLOYMENT_GUIDE.md"
echo -e "  • Run wizard again: ./deploy.sh"
echo -e "  • Check status: git status"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
