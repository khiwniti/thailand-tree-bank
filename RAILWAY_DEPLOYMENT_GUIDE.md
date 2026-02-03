# Thailand Tree Bank - Railway Deployment Guide

## 🎉 Railway Project Created!

**Project Name:** thailand-tree-bank
**Project URL:** https://railway.com/project/2e0e5bc3-e63f-4b4f-ab8b-c4968f2e143e

Your backend service has been deployed but needs configuration to run successfully.

---

## 📋 Step-by-Step Configuration

### Step 1: Configure Backend Service

1. **Open Railway Dashboard:**
   - Go to: https://railway.com/project/2e0e5bc3-e63f-4b4f-ab8b-c4968f2e143e
   - Click on the "thailand-tree-bank" service

2. **Set Builder to Dockerfile:**
   - Click on "Settings" tab
   - Under "Build", select "Dockerfile" as the builder
   - Save changes

3. **Add PostgreSQL Database:**
   - Click "+ New" button in the project
   - Select "Database" → "Add PostgreSQL"
   - This will create a PostgreSQL database and automatically set `DATABASE_URL`

4. **Add Redis Cache:**
   - Click "+ New" button in the project
   - Select "Database" → "Add Redis"
   - This will create a Redis instance and set `REDIS_URL`
   - Set additional Redis variables:
     ```
     REDIS_TLS=true
     REDIS_SNI=<redis-hostname>
     ```

5. **Set Required Environment Variables:**
   - Click on the backend service
   - Go to "Variables" tab
   - Add these variables:

   ```env
   # Backend Configuration
   NODE_ENV=production
   PORT=${{RAILWAY_PUBLIC_PORT}}

   # Authentication (REQUIRED - Generate your own)
   JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

   # LINE Integration (REQUIRED - From LINE Developers Console)
   LINE_CHANNEL_SECRET=your-line-channel-secret

   # AI Services (Optional but recommended)
   GEMINI_API_KEY=your-gemini-api-key

   # CORS Configuration
   FRONTEND_URL=https://your-frontend-url.railway.app
   ```

6. **Generate Domain:**
   - In "Settings" tab
   - Under "Networking"
   - Click "Generate Domain"
   - Copy the generated URL (e.g., `https://thailand-tree-bank-production.up.railway.app`)

7. **Trigger Redeploy:**
   - Click "Deployments" tab
   - Click "Deploy" → "Redeploy"

---

### Step 2: Deploy Frontend Service

1. **Create Frontend Service:**
   - In the main project view
   - Click "+ New" button
   - Select "Empty Service"
   - Name it "frontend"

2. **Deploy Frontend Code:**
   ```bash
   cd /home/user/line-liff-v2-starter/frontend
   railway service link frontend
   railway up
   ```

3. **Set Frontend Environment Variables:**
   - Go to frontend service in Railway dashboard
   - Click "Variables" tab
   - Add these variables:

   ```env
   # LINE LIFF Configuration (REQUIRED)
   VITE_LIFF_ID=your-liff-id-from-line-developers-console

   # Backend API URL (Use the backend domain from Step 1.6)
   VITE_API_URL=https://thailand-tree-bank-production.up.railway.app

   # AI Services (Optional)
   VITE_OPENROUTER_API_KEY=your-openrouter-api-key
   VITE_GEMINI_API_KEY=your-gemini-api-key
   ```

4. **Set Builder to Dockerfile:**
   - Click "Settings" tab
   - Under "Build", select "Dockerfile"
   - Save

5. **Generate Domain:**
   - Under "Networking" in Settings
   - Click "Generate Domain"
   - Copy the URL (e.g., `https://frontend-production.up.railway.app`)

6. **Update Backend FRONTEND_URL:**
   - Go back to backend service
   - Update `FRONTEND_URL` variable with the frontend domain

---

## 🔑 Required Credentials

Before deployment is functional, you need:

### From LINE Developers Console
- **VITE_LIFF_ID**: Your LIFF app ID (format: `xxxx-xxxxxxxx`)
- **LINE_CHANNEL_SECRET**: Your LINE channel secret

### Generate Yourself
- **JWT_SECRET**: A random secure string (use: `openssl rand -base64 32`)

### Optional (for AI Features)
- **GEMINI_API_KEY**: From Google AI Studio
- **VITE_OPENROUTER_API_KEY**: From OpenRouter.ai

---

## 🧪 Testing Deployment

### Backend Health Check
```bash
curl https://thailand-tree-bank-production.up.railway.app/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "...",
  "database": "connected",
  "redis": "connected",
  "version": "1.0.0"
}
```

### Frontend Test
Open your frontend URL in a browser. It should load the React app.

For LIFF testing, update your LIFF app endpoint URL in LINE Developers Console to your frontend Railway URL.

---

## 📊 Monitoring

### View Logs
```bash
# Backend logs
railway logs --service thailand-tree-bank

# Frontend logs
railway logs --service frontend
```

### Check Deployment Status
```bash
railway service status --all
```

---

## 🚀 Quick Commands

```bash
# Redeploy backend
railway up --service thailand-tree-bank

# Redeploy frontend
railway up --service frontend

# View all services
railway service status --all

# Open Railway dashboard
railway open
```

---

## ⚠️ Important Notes

1. **Database Migrations**: After PostgreSQL is added, run:
   ```bash
   railway run --service thailand-tree-bank npx prisma migrate deploy
   ```

2. **LIFF Endpoint Update**: Update your LIFF app endpoint URL in LINE Developers Console to your frontend Railway domain.

3. **Environment Variables**: All environment variables are stored securely in Railway and never exposed in logs.

4. **Automatic Deployments**: Railway will automatically deploy when you push to your connected Git repository (if configured).

---

## 🔧 Troubleshooting

### Backend Fails to Start
- Check DATABASE_URL is set (automatically set when PostgreSQL is added)
- Verify JWT_SECRET is set
- Check logs: `railway logs --service thailand-tree-bank`

### Frontend Shows Blank Page
- Verify VITE_LIFF_ID is set correctly
- Check VITE_API_URL points to backend domain
- Open browser console for JavaScript errors

### Database Connection Issues
- Ensure PostgreSQL plugin is added
- Check DATABASE_URL in backend variables
- Run migrations: `railway run --service thailand-tree-bank npx prisma migrate deploy`

---

## 📞 Support

- **Railway Documentation**: https://docs.railway.com
- **Railway Discord**: https://discord.gg/railway
- **Project Dashboard**: https://railway.com/project/2e0e5bc3-e63f-4b4f-ab8b-c4968f2e143e

---

**Deployment initiated by Claude Code**
**Date**: February 3, 2026

🚂 **All aboard the Railway! Your Thailand Tree Bank is ready to deploy!**
