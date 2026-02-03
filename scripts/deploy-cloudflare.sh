#!/bin/bash

# Deploy to Cloudflare Pages Script
# This script helps deploy the Thailand Tree Bank frontend to Cloudflare Pages

set -e  # Exit on error

echo "🌳 Thailand Tree Bank - Cloudflare Pages Deployment"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo -e "${YELLOW}⚠️  Wrangler CLI not found. Installing...${NC}"
    npm install -g wrangler
fi

# Navigate to frontend directory
cd "$(dirname "$0")/../frontend"

echo -e "${GREEN}✓${NC} Navigated to frontend directory"
echo ""

# Check for environment variables
echo "📋 Checking environment configuration..."
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  .env.local not found${NC}"
    echo "   Creating from .env.example..."

    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo -e "${GREEN}✓${NC} Created .env.local - please edit it with your actual values"
    else
        echo -e "${RED}✗${NC} .env.example not found. Creating template..."
        cat > .env.local <<EOF
# LINE LIFF Configuration
VITE_LIFF_ID=your_liff_id_here

# API Configuration
VITE_API_URL=http://localhost:8080

# AI Services (Optional)
VITE_OPENROUTER_API_KEY=your_openrouter_key_here
VITE_GEMINI_API_KEY=your_gemini_key_here
EOF
        echo -e "${GREEN}✓${NC} Created .env.local template"
    fi

    echo ""
    echo -e "${YELLOW}Please edit .env.local with your actual values before deploying!${NC}"
    echo "Press Enter to continue or Ctrl+C to exit..."
    read
fi

echo -e "${GREEN}✓${NC} Environment configuration found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo -e "${GREEN}✓${NC} Dependencies installed"
echo ""

# Build the project
echo "🔨 Building project..."
npm run build
echo -e "${GREEN}✓${NC} Build completed"
echo ""

# Check if build directory exists
if [ ! -d "dist" ]; then
    echo -e "${RED}✗${NC} Build directory 'dist' not found!"
    exit 1
fi

echo -e "${GREEN}✓${NC} Build directory verified"
echo ""

# Display deployment options
echo "🚀 Ready to deploy!"
echo ""
echo "Choose deployment method:"
echo "  1. Deploy to Cloudflare Pages (automatic)"
echo "  2. Deploy with custom project name"
echo "  3. Deploy to specific branch"
echo "  4. Show deployment commands only (manual)"
echo ""
read -p "Enter choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "Deploying to Cloudflare Pages..."
        wrangler pages deploy dist --project-name=thailand-tree-bank
        ;;
    2)
        echo ""
        read -p "Enter project name: " project_name
        wrangler pages deploy dist --project-name="$project_name"
        ;;
    3)
        echo ""
        read -p "Enter branch name: " branch_name
        wrangler pages deploy dist --project-name=thailand-tree-bank --branch="$branch_name"
        ;;
    4)
        echo ""
        echo "Manual deployment commands:"
        echo ""
        echo "# Install Wrangler (if not already installed):"
        echo "npm install -g wrangler"
        echo ""
        echo "# Login to Cloudflare:"
        echo "wrangler login"
        echo ""
        echo "# Deploy to production:"
        echo "wrangler pages deploy dist --project-name=thailand-tree-bank"
        echo ""
        echo "# Deploy to preview/branch:"
        echo "wrangler pages deploy dist --project-name=thailand-tree-bank --branch=preview"
        echo ""
        exit 0
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Deployment completed!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Configure environment variables in Cloudflare Dashboard:"
echo "   - Go to: Workers & Pages → thailand-tree-bank → Settings → Environment variables"
echo "   - Add: VITE_LIFF_ID, VITE_API_URL, etc."
echo ""
echo "2. Test your deployment:"
echo "   - Visit: https://your-project.pages.dev"
echo ""
echo "3. Update LIFF endpoint URL in LINE Developers Console:"
echo "   - Set endpoint to: https://your-project.pages.dev"
echo ""
echo "4. Access via LINE:"
echo "   - https://liff.line.me/{YOUR_LIFF_ID}"
echo ""
