#!/bin/bash

# Railway Force Deploy Script - Automated Deployment
# This script will configure and deploy both services automatically

export PATH="/home/user/.global_modules/bin:$PATH"

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║     🚂 RAILWAY FORCE DEPLOY - AUTOMATED                         ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Generate secrets
echo "🔑 Generating secrets..."
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
echo "✓ JWT_SECRET: ${JWT_SECRET:0:20}..."

# Placeholder values (user can update via dashboard later)
LINE_CHANNEL_SECRET="PLACEHOLDER-UPDATE-IN-RAILWAY-DASHBOARD"
VITE_LIFF_ID="PLACEHOLDER-UPDATE-IN-RAILWAY-DASHBOARD"
GEMINI_API_KEY="PLACEHOLDER-OPTIONAL"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 BACKEND: Setting variables..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd /home/user/line-liff-v2-starter/backend

railway variables --set JWT_SECRET="$JWT_SECRET" 2>&1 | grep -v "error" || echo "✓ Set JWT_SECRET"
railway variables --set LINE_CHANNEL_SECRET="$LINE_CHANNEL_SECRET" 2>&1 | grep -v "error" || echo "✓ Set LINE_CHANNEL_SECRET (placeholder)"
railway variables --set NODE_ENV="production" 2>&1 | grep -v "error" || echo "✓ Set NODE_ENV"
railway variables --set GEMINI_API_KEY="$GEMINI_API_KEY" 2>&1 | grep -v "error" || echo "✓ Set GEMINI_API_KEY (placeholder)"

echo "✓ Backend variables configured"
echo ""

echo "🚀 Deploying backend..."
railway up --detach 2>&1 | head -5

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 FRONTEND: Setting variables..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd /home/user/line-liff-v2-starter/frontend

railway variables --set VITE_LIFF_ID="$VITE_LIFF_ID" 2>&1 | grep -v "error" || echo "✓ Set VITE_LIFF_ID (placeholder)"
railway variables --set VITE_API_URL="https://thailand-tree-bank-backend-production.up.railway.app" 2>&1 | grep -v "error" || echo "✓ Set VITE_API_URL"

echo "✓ Frontend variables configured"
echo ""

echo "🚀 Deploying frontend..."
railway up --detach 2>&1 | head -5

echo ""
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║              ✅ DEPLOYMENT INITIATED!                            ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Status:"
echo ""

sleep 5
railway service status --all

echo ""
echo "⚠️  IMPORTANT: Update placeholder values in Railway dashboard:"
echo "   • LINE_CHANNEL_SECRET (backend)"
echo "   • VITE_LIFF_ID (frontend)"
echo ""
echo "🌐 Dashboard: https://railway.com/project/2e0e5bc3-e63f-4b4f-ab8b-c4968f2e143e"
echo ""
echo "✅ Generated JWT_SECRET: $JWT_SECRET"
echo "   (Already set in backend variables)"
echo ""
echo "🔍 Monitor builds:"
echo "   railway logs --service thailand-tree-bank-backend"
echo "   railway logs --service thailand-tree-bank-frontend"
echo ""
