#!/bin/bash

# Interactive Deployment Helper for Thailand Tree Bank
# This script guides you through deploying frontend and backend

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Emojis
CHECK="✅"
ROCKET="🚀"
WARNING="⚠️"
INFO="ℹ️"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  🌳 Thailand Tree Bank - Deployment Helper${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Function to show a step
show_step() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}${ROCKET} $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

# Function to show info
show_info() {
    echo -e "${BLUE}${INFO} $1${NC}"
}

# Function to show success
show_success() {
    echo -e "${GREEN}${CHECK} $1${NC}"
}

# Function to show warning
show_warning() {
    echo -e "${YELLOW}${WARNING} $1${NC}"
}

# Check current directory
if [ ! -f "package.json" ] || [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    show_warning "Please run this script from the project root directory"
    exit 1
fi

show_success "Project directory verified"

# Main menu
echo "What would you like to deploy?"
echo ""
echo "  1. ${GREEN}Frontend Only${NC} (Cloudflare Pages - Recommended)"
echo "  2. ${GREEN}Backend Only${NC} (Railway/Render)"
echo "  3. ${GREEN}Both Frontend & Backend${NC} (Complete deployment)"
echo "  4. ${BLUE}Just show me the instructions${NC} (Manual setup)"
echo "  5. ${BLUE}Check deployment status${NC}"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        show_step "Frontend Deployment to Cloudflare Pages"

        # Check if frontend is built
        if [ ! -d "frontend/dist" ]; then
            show_info "Building frontend..."
            cd frontend
            npm install
            npm run build
            cd ..
            show_success "Frontend built successfully"
        else
            show_success "Frontend already built (dist/ exists)"
        fi

        echo ""
        echo "Choose deployment method:"
        echo "  a) ${GREEN}GitHub Integration${NC} (Automatic, recommended)"
        echo "  b) ${BLUE}Wrangler CLI${NC} (Manual)"
        echo ""
        read -p "Enter your choice (a/b): " deploy_method

        if [ "$deploy_method" = "a" ]; then
            show_step "GitHub Integration Setup"
            echo ""
            show_info "Follow these steps:"
            echo ""
            echo "1. Open: ${BLUE}https://dash.cloudflare.com/${NC}"
            echo "2. Click: Workers & Pages → Create application → Pages"
            echo "3. Click: Connect to Git → Select GitHub"
            echo "4. Choose repository: ${GREEN}khiwniti/thailand-tree-bank${NC}"
            echo "5. Configure build:"
            echo "   ${BLUE}Build command:${NC} cd frontend && npm install && npm run build"
            echo "   ${BLUE}Build output directory:${NC} frontend/dist"
            echo "   ${BLUE}Root directory:${NC} /"
            echo ""
            echo "6. Add environment variables:"
            echo "   ${GREEN}VITE_LIFF_ID${NC} = 2008934197-jM9Zoogn"
            echo "   ${GREEN}VITE_OPENROUTER_API_KEY${NC} = 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"
            echo "   ${YELLOW}VITE_API_URL${NC} = (Add after backend deployment)"
            echo ""
            echo "7. Click: Save and Deploy"
            echo ""
            show_success "Your site will be live at: https://thailand-tree-bank.pages.dev"
            echo ""
            read -p "Press Enter when deployment is complete..."

        elif [ "$deploy_method" = "b" ]; then
            show_step "Wrangler CLI Deployment"

            # Check if logged in
            if ! wrangler whoami 2>&1 | grep -q "email"; then
                show_warning "You need to login to Wrangler first"
                echo ""
                show_info "Run this command in a new terminal:"
                echo "  ${GREEN}wrangler login${NC}"
                echo ""
                read -p "Press Enter after logging in..."
            fi

            show_info "Deploying to Cloudflare Pages..."
            cd frontend
            wrangler pages deploy dist --project-name=thailand-tree-bank
            cd ..
            show_success "Frontend deployed!"
        fi
        ;;

    2)
        show_step "Backend Deployment"

        echo "Choose platform:"
        echo "  a) ${GREEN}Railway${NC} (Recommended - Free PostgreSQL + Redis)"
        echo "  b) ${BLUE}Render${NC} (Alternative - Free tier available)"
        echo "  c) ${BLUE}Show manual instructions${NC}"
        echo ""
        read -p "Enter your choice (a/b/c): " platform

        if [ "$platform" = "a" ]; then
            show_step "Railway Deployment"

            # Check if Railway CLI is installed
            if ! command -v railway &> /dev/null; then
                show_warning "Railway CLI not found. Installing..."
                npm install -g @railway/cli
                show_success "Railway CLI installed"
            fi

            # Check if logged in
            if ! railway whoami 2>&1 | grep -q "Logged in"; then
                show_warning "Please login to Railway"
                railway login
            fi

            show_info "Setting up backend on Railway..."
            cd backend

            # Check if project is linked
            if [ ! -f "railway.json" ] && [ ! -f ".railway/railway.json" ]; then
                show_info "Creating new Railway project..."
                railway init
            fi

            # Deploy
            show_info "Deploying backend..."
            railway up

            # Get URL
            BACKEND_URL=$(railway domain 2>&1 | grep -o 'https://[^[:space:]]*' | head -1)

            cd ..

            show_success "Backend deployed!"
            echo ""
            show_info "Backend URL: ${GREEN}${BACKEND_URL}${NC}"
            echo ""
            show_warning "Don't forget to:"
            echo "  1. Add PostgreSQL database in Railway dashboard"
            echo "  2. Run: railway run npx prisma db push"
            echo "  3. Update VITE_API_URL in frontend to: ${BACKEND_URL}"

        elif [ "$platform" = "b" ]; then
            show_step "Render Deployment"
            show_info "Manual setup required"
            echo ""
            echo "1. Visit: ${BLUE}https://render.com${NC}"
            echo "2. Sign in with GitHub"
            echo "3. New → Web Service"
            echo "4. Connect: khiwniti/thailand-tree-bank"
            echo "5. Configure:"
            echo "   ${BLUE}Name:${NC} thailand-tree-bank-backend"
            echo "   ${BLUE}Root Directory:${NC} backend"
            echo "   ${BLUE}Build Command:${NC} npm install && npx prisma generate && npm run build"
            echo "   ${BLUE}Start Command:${NC} npm start"
            echo "6. Add PostgreSQL database"
            echo "7. Set environment variables (see DEPLOYMENT_GUIDE.md)"
            echo ""

        else
            show_info "See DEPLOYMENT_GUIDE.md for detailed instructions"
        fi
        ;;

    3)
        show_step "Complete Deployment - Frontend & Backend"

        # Deploy backend first
        show_info "Step 1: Deploying Backend..."
        bash "$0" <<< "2
a"

        echo ""
        read -p "Enter your backend URL: " backend_url

        # Update frontend env var
        show_info "Step 2: Deploying Frontend with API URL..."
        echo ""
        show_warning "Remember to set VITE_API_URL=${backend_url} in Cloudflare"
        bash "$0" <<< "1
a"

        show_success "Complete deployment finished!"
        ;;

    4)
        show_step "Manual Deployment Instructions"
        echo ""
        show_info "Documentation files:"
        echo "  📄 ${GREEN}DEPLOYMENT_GUIDE.md${NC} - Complete guide"
        echo "  📄 ${GREEN}CLOUDFLARE_SETUP.md${NC} - Frontend setup"
        echo "  📄 ${GREEN}QUICK_FIX.md${NC} - Quick start"
        echo ""
        show_info "Opening DEPLOYMENT_GUIDE.md..."
        cat DEPLOYMENT_GUIDE.md | less
        ;;

    5)
        show_step "Deployment Status Check"
        echo ""

        # Check frontend
        show_info "Checking frontend..."
        FRONTEND_URL="https://b02bd34b.thailand-tree-bank.pages.dev"
        if curl -sI "$FRONTEND_URL" | grep -q "200\|301\|302"; then
            show_success "Frontend is live: ${FRONTEND_URL}"
        else
            show_warning "Frontend not accessible at: ${FRONTEND_URL}"
        fi

        echo ""

        # Check backend (if deployed)
        show_info "Check backend manually:"
        echo "  Visit your Railway/Render dashboard"
        echo "  Or check: https://your-backend-url.railway.app/health"
        ;;

    *)
        show_warning "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
show_success "Deployment process complete!"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo "Next steps:"
echo "  1. Test your frontend: https://thailand-tree-bank.pages.dev"
echo "  2. Update LIFF endpoint URL in LINE Developers Console"
echo "  3. Test in LINE: https://liff.line.me/2008934197-jM9Zoogn"
echo ""
show_info "For help, see: DEPLOYMENT_GUIDE.md"
echo ""
