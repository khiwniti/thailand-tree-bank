# 🚀 Northflank Deployment Guide - Thailand Tree Bank LINE Mini App

Complete guide for deploying the LINE Mini App to Northflank with PostgreSQL and Redis.

---

## 📋 Prerequisites

Before deploying, ensure you have:

1. ✅ **Northflank Account** - Sign up at https://northflank.com
2. ✅ **GitHub Repository** - Connected to Northflank
3. ✅ **LINE LIFF App** - Created in LINE Developers Console
4. ✅ **Google Gemini API Key** - For AI features (optional but recommended)
5. ✅ **Domain Name** - For production endpoint (optional, Northflank provides free subdomain)

---

## 🏗️ Architecture Overview

This deployment consists of **3 services**:

```
┌─────────────────────────────────────────────────────┐
│                  Northflank Project                 │
│                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │
│  │   Frontend   │  │   Backend    │  │  Addons  │ │
│  │   (Nginx)    │  │  (Node.js)   │  │          │ │
│  │              │  │              │  │ PostgeSQL│ │
│  │  Port: 80    │  │  Port: 8080  │  │  Redis   │ │
│  └──────────────┘  └──────────────┘  └──────────┘ │
│         │                  │                │      │
│         └──────────────────┴────────────────┘      │
│                   Public Internet                  │
└─────────────────────────────────────────────────────┘
```

---

## 📦 Step 1: Create Northflank Project

### 1.1 Create New Project

1. Log in to [Northflank Dashboard](https://app.northflank.com)
2. Click **"Create Project"**
3. Enter project details:
   - **Name:** `thailand-tree-bank`
   - **Description:** `Thailand Government Tree Bank - LINE Mini App`
   - **Region:** Choose closest to Thailand (e.g., `asia-southeast1` Singapore)
4. Click **"Create Project"**

---

## 🗄️ Step 2: Add Database Services (Addons)

### 2.1 Add PostgreSQL Database

1. In your project, click **"Add Service"** → **"Addon"**
2. Select **"PostgreSQL"**
3. Configure:
   - **Name:** `tree-bank-postgres`
   - **Version:** `15` (recommended)
   - **Plan:** Start with `Free` or `Starter` plan
   - **Storage:** 1GB minimum (increase as needed)
4. Click **"Create Addon"**
5. **Wait for provisioning** (~2-3 minutes)
6. **Save connection string** (you'll need this for backend env vars)

### 2.2 Add Redis Cache

1. Click **"Add Service"** → **"Addon"**
2. Select **"Redis"**
3. Configure:
   - **Name:** `tree-bank-redis`
   - **Version:** `7` (recommended)
   - **Plan:** `Free` or `Starter`
4. Click **"Create Addon"**
5. **Save connection string**

---

## 🔧 Step 3: Deploy Backend API

### 3.1 Create Backend Service

1. Click **"Add Service"** → **"Combined Service"**
2. Choose **"Docker"** as build method
3. Configure repository:
   - **Source:** GitHub
   - **Repository:** `khiwniti/CarbonPlot`
   - **Branch:** `master`
   - **Dockerfile Path:** `/backend/Dockerfile`
   - **Build Context:** `/backend`

### 3.2 Backend Environment Variables

Add these environment variables in Northflank:

```bash
# Database
DATABASE_URL=${postgresql://tree-bank-postgres:CONNECTION_STRING}
REDIS_URL=${redis://tree-bank-redis:CONNECTION_STRING}

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars

# LINE Configuration
LINE_CHANNEL_ID=2008934197
LINE_CHANNEL_SECRET=your-line-channel-secret-from-console

# API Configuration
PORT=8080
NODE_ENV=production

# CORS (Frontend URL - will be updated after frontend deployment)
CORS_ORIGIN=https://tree-bank.northflank.app

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=/app/uploads

# Optional: Google Gemini AI
GEMINI_API_KEY=your-gemini-api-key-here
```

### 3.3 Backend Service Settings

- **Service Name:** `tree-bank-backend`
- **Port:** `8080`
- **Health Check Path:** `/health`
- **Replicas:** `1` (increase for production)
- **Resources:**
  - CPU: `0.2 vCPU` (minimum)
  - Memory: `512 MB` (minimum)

### 3.4 Run Database Migrations

After backend deploys, run Prisma migrations:

1. Go to backend service → **"Jobs"** → **"Create Job"**
2. Configure:
   - **Name:** `db-migrate`
   - **Command:** `npx prisma migrate deploy`
   - **Run Once:** Yes
3. Click **"Run Job"**
4. Check logs to verify migration success

---

## 🎨 Step 4: Deploy Frontend

### 4.1 Create Frontend Service

1. Click **"Add Service"** → **"Combined Service"**
2. Choose **"Docker"** as build method
3. Configure repository:
   - **Source:** GitHub
   - **Repository:** `khiwniti/CarbonPlot`
   - **Branch:** `master`
   - **Dockerfile Path:** `/src/line/Dockerfile`
   - **Build Context:** `/src/line`

### 4.2 Frontend Build Arguments

These are injected **during build time**:

```bash
VITE_LIFF_ID=2008934197-jM9Zoogn
VITE_GEMINI_API_KEY=your-gemini-api-key-here
VITE_API_URL=https://tree-bank-backend.northflank.app
```

**Important:** Build arguments are baked into the JavaScript bundle. Update LIFF endpoint URL after deployment!

### 4.3 Frontend Service Settings

- **Service Name:** `tree-bank-frontend`
- **Port:** `80`
- **Health Check Path:** `/health`
- **Replicas:** `1` (can scale up)
- **Resources:**
  - CPU: `0.1 vCPU` (minimum - nginx is lightweight)
  - Memory: `256 MB` (minimum)

---

## 🔗 Step 5: Configure Networking

### 5.1 Enable Public Access

1. **Backend Service:**
   - Go to service → **"Networking"**
   - Enable **"External Access"**
   - Note the URL: `https://tree-bank-backend-xxx.northflank.app`
   - Add custom domain (optional): `api.tree-bank.com`

2. **Frontend Service:**
   - Go to service → **"Networking"**
   - Enable **"External Access"**
   - Note the URL: `https://tree-bank-frontend-xxx.northflank.app`
   - Add custom domain (optional): `tree-bank.com`

### 5.2 Update Environment Variables

After getting URLs, update:

1. **Backend `CORS_ORIGIN`:**
   ```bash
   CORS_ORIGIN=https://tree-bank-frontend-xxx.northflank.app
   ```

2. **Frontend `VITE_API_URL`** (rebuild required):
   ```bash
   VITE_API_URL=https://tree-bank-backend-xxx.northflank.app
   ```

3. **Redeploy both services** to apply changes

---

## 🔐 Step 6: Update LINE LIFF Configuration

### 6.1 Update LIFF Endpoint URL

1. Go to [LINE Developers Console](https://developers.line.biz/console/)
2. Select your channel
3. Go to **"LIFF"** tab
4. Click on your LIFF app: `2008934197-jM9Zoogn`
5. Click **"Edit"**
6. Update **Endpoint URL:**
   ```
   https://tree-bank-frontend-xxx.northflank.app
   ```
   Or your custom domain:
   ```
   https://tree-bank.com
   ```
7. Click **"Update"**

---

## ✅ Step 7: Verify Deployment

### 7.1 Health Checks

Test both services:

```bash
# Backend health check
curl https://tree-bank-backend-xxx.northflank.app/health

# Frontend health check
curl https://tree-bank-frontend-xxx.northflank.app/health
```

### 7.2 Test in LINE App

1. **Send LIFF URL to yourself in LINE:**
   ```
   https://liff.line.me/2008934197-jM9Zoogn
   ```
2. **Click the link in LINE app**
3. **Should auto-login** and show the app

---

## 🐛 Troubleshooting

### Frontend Issues

**Problem:** LIFF endpoint mismatch warning
- Update LIFF endpoint URL in LINE Developers Console

**Problem:** Map not displaying
- Verify Leaflet images are in build (check `public/images/`)

### Backend Issues

**Problem:** Database connection errors
- Check `DATABASE_URL` environment variable
- Verify PostgreSQL addon is running

**Problem:** CORS errors
- Update `CORS_ORIGIN` to match frontend URL
- Restart backend service

---

## 📈 Scaling Recommendations

| Users | Frontend | Backend | DB Plan | Cost |
|-------|----------|---------|---------|------|
| <1K | 1 replica | 1 replica | Starter | $20/mo |
| 1K-10K | 2 replicas | 2 replicas | Standard | $50/mo |
| 10K+ | 3+ replicas | 3+ replicas | Pro | $150+/mo |

---

## ✅ Deployment Checklist

**Pre-Deployment:**
- [ ] Code committed to GitHub
- [ ] Environment variables ready
- [ ] LIFF ID configured

**During Deployment:**
- [ ] Create Northflank project
- [ ] Deploy PostgreSQL
- [ ] Deploy Redis
- [ ] Deploy backend
- [ ] Run migrations
- [ ] Deploy frontend
- [ ] Update LIFF endpoint

**Post-Deployment:**
- [ ] Test health checks
- [ ] Test in LINE app
- [ ] Enable auto-deploy
- [ ] Set up monitoring

---

## 🚀 You're Ready!

All files prepared:
- ✅ `src/line/Dockerfile`
- ✅ `src/line/nginx.conf`
- ✅ `backend/Dockerfile`
- ✅ `backend/prisma/schema.prisma`

**Next:** Go to https://app.northflank.com

---

*Repository: https://github.com/khiwniti/CarbonPlot*
