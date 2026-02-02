# 🚀 Complete Deployment Guide - Tree Bank LINE Mini App

> **Full deployment instructions for frontend + backend**

---

## 📋 Overview

Your Tree Bank system now has:

✅ **Frontend:** LINE Mini App (React + Vite + LIFF)
✅ **Backend:** REST API (Node.js + Express + Prisma)
✅ **Database:** PostgreSQL (already configured)
✅ **Cache:** Redis (already configured)
✅ **AI:** Google Gemini

---

## 🎯 What's Been Configured

### Frontend (`src/line/`)
- ✅ LIFF ID: `2008934197-jM9Zoogn`
- ✅ LIFF authentication with useLiff hook
- ✅ Thai language UI
- ✅ Land unit conversions (ไร่-งาน-วา)
- ✅ Settings modal
- ✅ Mock data generator

### Backend (`backend/`)
- ✅ Express server setup
- ✅ Prisma schema (Users, Plots, Trees, Documents, etc.)
- ✅ PostgreSQL connection configured
- ✅ Redis connection configured
- ✅ JWT authentication middleware
- ✅ REST API routes (auth, plots, trees, carbon)

---

## 🔧 Setup Instructions

### Step 1: Frontend Setup

```bash
cd /home/user/line-liff-v2-starter/src/line

# Environment is already configured with your LIFF ID
# Just add Gemini API key to .env.local:
# VITE_GEMINI_API_KEY=your_key_here

# Install dependencies (already done)
npm install

# Start development server
npm run dev
```

**Access:** `http://localhost:3000`

### Step 2: Backend Setup

```bash
cd /home/user/line-liff-v2-starter/backend

# Update .env with missing credentials:
# - JWT_SECRET (generate a random string)
# - LINE_CHANNEL_SECRET (from LINE Console)
# - GEMINI_API_KEY (for AI features)

# Install dependencies (already done)
npm install

# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Start backend server
npm run dev
```

**Access:** `http://localhost:8080`

### Step 3: Test Integration

```bash
# Test backend health
curl http://localhost:8080/health

# Should return:
# {
#   "status": "OK",
#   "database": "connected",
#   "redis": "connected"
# }
```

---

## 🌐 Deployment Options

### Option 1: Deploy Frontend to Netlify

```bash
cd /home/user/line-liff-v2-starter/src/line

# Build
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --dir=dist --prod

# Set environment variables in Netlify Dashboard:
# VITE_LIFF_ID=2008934197-jM9Zoogn
# VITE_GEMINI_API_KEY=your_key
# VITE_API_URL=https://your-backend-url.com
```

### Option 2: Deploy Backend to Railway/Render

**Railway:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up

# Set environment variables in Railway Dashboard
```

**Render:**
1. Connect GitHub repo
2. Create Web Service
3. Build command: `cd backend && npm install && npm run build`
4. Start command: `npm start`
5. Add environment variables

### Option 3: Deploy Both to Google Cloud Run

```bash
# Frontend Dockerfile
cd /home/user/line-liff-v2-starter/src/line
gcloud run deploy tree-bank-frontend \
  --source . \
  --region asia-southeast1

# Backend Dockerfile
cd /home/user/line-liff-v2-starter/backend
gcloud run deploy tree-bank-backend \
  --source . \
  --region asia-southeast1
```

---

## 📱 LIFF URL Configuration

After deploying frontend, update LIFF settings:

1. Go to https://developers.line.biz/console/
2. Select your LIFF app (ID: `2008934197-jM9Zoogn`)
3. Update **Endpoint URL** to your deployed URL:
   - Example: `https://tree-bank.netlify.app`
4. Save changes

**Test URL:**
```
https://liff.line.me/2008934197-jM9Zoogn
```

Send this URL to yourself in LINE to test the app.

---

## 🔐 Environment Variables Summary

### Frontend (.env.local)
```env
VITE_LIFF_ID=2008934197-jM9Zoogn
VITE_GEMINI_API_KEY=your_gemini_key
VITE_API_URL=https://your-backend-url.com
```

### Backend (.env)
```env
DATABASE_URL=postgresql://_140015aa6d48cb43:_fb59a0b931a1b7e2e5f72b0a917f0c@primary.liff-db--q4wt5c4d9mvq.addon.code.run:28996/_83707e411701?sslmode=require
REDIS_URL=rediss://default:808027dc8dbb883958e01a0cd3366578@master.liff-cache--q4wt5c4d9mvq.addon.code.run:6379
REDIS_TLS=true
REDIS_SNI=master.liff-cache--q4wt5c4d9mvq.addon.code.run
JWT_SECRET=generate_random_string_here
LINE_CHANNEL_SECRET=your_line_channel_secret
GEMINI_API_KEY=your_gemini_key
FRONTEND_URL=https://your-frontend-url.com
PORT=8080
```

---

## 🧪 Testing Checklist

### Frontend Testing

```bash
cd /home/user/line-liff-v2-starter/src/line

# Check for TypeScript errors
npx tsc --noEmit

# Build for production
npm run build

# Preview production build
npm run preview
```

Test in LINE app:
1. Send LIFF URL to yourself in LINE
2. Click the link
3. Should see login screen
4. Login with LINE
5. See your profile in header
6. Test all features

### Backend Testing

```bash
cd /home/user/line-liff-v2-starter/backend

# Test compilation
npm run build

# Test endpoints
curl http://localhost:8080/health
curl http://localhost:8080/api
```

---

## 🎬 Demo Preparation

### For Next Week's Presentation

1. **Deploy frontend to Netlify** (free, easy, fast)
2. **Keep backend local** for demo (or deploy to Railway free tier)
3. **Test on actual phone** (iOS + Android)
4. **Prepare backup video** in case live demo fails
5. **Create demo script** (see QUICKSTART.md)

### Quick Demo Deploy

```bash
# Deploy frontend only (backend can wait)
cd /home/user/line-liff-v2-starter/src/line
npm run build
netlify deploy --dir=dist --prod

# Update LIFF Endpoint URL in LINE Console
# Test in LINE app
# Ready for demo!
```

---

## 📊 System Architecture

```
┌─────────────────┐
│   LINE App      │
│   (Mobile)      │
└────────┬────────┘
         │
         │ HTTPS
         │
┌────────▼────────┐
│  LIFF Mini App  │ ← Frontend (Netlify)
│  React + Vite   │
└────────┬────────┘
         │
         │ REST API
         │
┌────────▼────────┐
│  Express API    │ ← Backend (Railway/Render)
│  Node.js        │
└────┬─────┬──────┘
     │     │
     │     │
┌────▼─┐ ┌▼──────┐
│ DB   │ │ Redis │ ← Already configured!
│ PG   │ │ Cache │
└──────┘ └───────┘
```

---

## ✅ Current Status

### Completed ✅
- [x] LIFF Integration
- [x] useLiff hook
- [x] Thai land units
- [x] Settings modal
- [x] Mock data generator
- [x] Backend API structure
- [x] Prisma schema
- [x] Database configured
- [x] Redis configured
- [x] Auth routes
- [x] Plot routes
- [x] Tree routes
- [x] Carbon calculation

### Pending 🟡
- [ ] Add Gemini API key to .env.local
- [ ] Test in LINE app
- [ ] Deploy frontend
- [ ] Deploy backend (optional for demo)
- [ ] Prepare demo

### Future Features 🚀
- [ ] Offline mode (Phase 2)
- [ ] OCR for documents (Phase 3)
- [ ] AI tree detection (Phase 3)
- [ ] Verification workflow (Phase 4)

---

## 🎯 Next Immediate Steps

1. **Add Gemini API Key**
   ```bash
   cd /home/user/line-liff-v2-starter/src/line
   # Edit .env.local and add:
   # VITE_GEMINI_API_KEY=your_actual_key
   ```

2. **Test Frontend Locally**
   ```bash
   npm run dev
   # Open http://localhost:3000
   ```

3. **Deploy to Netlify**
   ```bash
   npm run build
   netlify deploy --dir=dist --prod
   ```

4. **Update LIFF Endpoint**
   - Go to LINE Console
   - Update endpoint to Netlify URL

5. **Test in LINE**
   - Send yourself: `https://liff.line.me/2008934197-jM9Zoogn`
   - Click and test!

---

## 🎊 You're Ready!

Everything is set up! Just:
1. Add your Gemini API key
2. Deploy frontend
3. Test in LINE
4. Prepare demo presentation

**Good luck with your demo! 🌳🚀**

---

**Created:** February 2, 2026
**Status:** ✅ Ready for Deployment
