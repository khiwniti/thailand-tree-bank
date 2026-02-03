# 🔧 Railway Deployment - Final Setup Guide

## Current Status

✅ **Infrastructure Ready:**
- Project Created: thailand-tree-bank
- PostgreSQL: ✅ Running
- PostGIS: ✅ Running  
- Redis: ✅ Running
- Backend Service: ⚠️ Needs configuration
- Frontend Service: ⚠️ Needs configuration

## 🐛 Issue Identified

Railway is using **Nixpacks** instead of **Dockerfile** despite railway.toml configuration.

**Root Cause**: Railway's auto-detection sometimes ignores railway.toml. Need to configure via dashboard.

## ✅ SOLUTION (5 Minutes via Dashboard)

### Step 1: Configure Backend to Use Dockerfile

1. Open: https://railway.com/project/2e0e5bc3-e63f-4b4f-ab8b-c4968f2e143e

2. Click on **"thailand-tree-bank-backend"** service

3. Go to **"Settings"** tab → **"Build"** section

4. Change **"Builder"** from "Nixpacks" to **"Dockerfile"**

5. **Dockerfile Path**: `Dockerfile` (default)

6. Click **"Save"**

7. Click **"Redeploy"** button

### Step 2: Add Required Environment Variables (Backend)

Still in backend service → **"Variables"** tab:

```env
# Generate JWT Secret first:
# Run: openssl rand -base64 32

JWT_SECRET=<paste-generated-secret-here>
LINE_CHANNEL_SECRET=<from-line-developers-console>
NODE_ENV=production
GEMINI_API_KEY=<optional-from-google-ai-studio>
```

The following are auto-set by Railway plugins:
- `DATABASE_URL` (from PostgreSQL/PostGIS)
- `REDIS_URL` (from Redis)
- `PORT` (Railway's internal port)

### Step 3: Generate Backend Domain

In backend service → **"Settings"** → **"Networking"**:
- Click **"Generate Domain"**
- Copy the URL (e.g., `https://thailand-tree-bank-backend-production.up.railway.app`)
- Save this for Step 5

### Step 4: Configure Frontend to Use Dockerfile

1. Click on **"thailand-tree-bank-frontend"** service

2. Go to **"Settings"** → **"Build"**

3. Change **"Builder"** to **"Dockerfile"**

4. Click **"Save"** and **"Redeploy"**

### Step 5: Add Frontend Environment Variables

In frontend service → **"Variables"** tab:

```env
VITE_LIFF_ID=<your-liff-id-from-line-console>
VITE_API_URL=<backend-domain-from-step-3>
VITE_OPENROUTER_API_KEY=<optional>
VITE_GEMINI_API_KEY=<optional>
```

### Step 6: Generate Frontend Domain

In frontend service → **"Settings"** → **"Networking"**:
- Click **"Generate Domain"**
- Copy the URL (e.g., `https://thailand-tree-bank-frontend-production.up.railway.app`)

### Step 7: Run Database Migrations

From your terminal:

```bash
railway run --service thailand-tree-bank-backend npx prisma migrate deploy
```

Or via Railway dashboard:
- Backend service → **"Deployments"** tab
- Click on latest deployment
- Open **"Terminal"** or **"Shell"**
- Run: `npx prisma migrate deploy`

### Step 8: Update Backend CORS

Go back to backend → **"Variables"** and add:

```env
FRONTEND_URL=<frontend-domain-from-step-6>
```

Then redeploy backend.

### Step 9: Update LIFF Endpoint URL

1. Go to [LINE Developers Console](https://developers.line.biz/console/)
2. Open your LIFF app
3. Update **"Endpoint URL"** to your frontend domain from Step 6
4. Save

## 🎯 Quick Reference

### Generate Secrets

```bash
# JWT Secret (256-bit)
openssl rand -base64 32

# Or stronger (512-bit)
openssl rand -base64 64
```

### Required Variables Summary

**Backend:**
```env
JWT_SECRET=<generated>
LINE_CHANNEL_SECRET=<from-line>
NODE_ENV=production
DATABASE_URL=<auto-set-by-railway>
REDIS_URL=<auto-set-by-railway>
PORT=<auto-set-by-railway>
FRONTEND_URL=<your-frontend-domain>
```

**Frontend:**
```env
VITE_LIFF_ID=<from-line>
VITE_API_URL=<your-backend-domain>
```

## ✅ Verification

### Test Backend

```bash
curl https://<your-backend-domain>/health
```

Expected:
```json
{
  "status": "OK",
  "database": "connected",
  "redis": "connected"
}
```

### Test Frontend

Open: `https://<your-frontend-domain>`

Should load the React app.

### Test LIFF

Send in LINE chat: `https://liff.line.me/<YOUR_LIFF_ID>`

Should open your app in LINE browser.

## 🗄️ PostGIS Migration Answer

**Q: Do I need to migrate from normal PostgreSQL to PostGIS?**

**A: NO! PostGIS IS PostgreSQL!**

PostGIS = PostgreSQL + Spatial Extensions

Your existing Prisma schema works perfectly. No code changes needed.

See: `docs/development/postgis-migration.md` for details.

## 📊 Current Services

```
thailand-tree-bank/
├── Backend (Node.js)      → Needs Dockerfile config
├── Frontend (React/Nginx) → Needs Dockerfile config  
├── PostgreSQL             → ✅ Running
├── PostGIS                → ✅ Running
└── Redis                  → ✅ Running
```

**Note**: You have both PostgreSQL and PostGIS. Use **PostGIS** (it's better) and you can remove the regular PostgreSQL from dashboard if you want.

## 🚀 After Setup Complete

Your app will be live at:
- **Backend API**: `https://thailand-tree-bank-backend-production.up.railway.app`
- **Frontend App**: `https://thailand-tree-bank-frontend-production.up.railway.app`
- **LIFF Access**: `https://liff.line.me/<YOUR_LIFF_ID>`

## 💡 Pro Tips

- Railway auto-deploys on git push (connect your GitHub repo in settings)
- Use Railway's metrics dashboard for monitoring
- Enable "Restart on Failure" in service settings
- Set up custom domains in Networking settings
- Use Railway's built-in logging and monitoring

---

**Total Setup Time**: ~5 minutes via dashboard

**See you at**: https://railway.com/project/2e0e5bc3-e63f-4b4f-ab8b-c4968f2e143e 🚂
