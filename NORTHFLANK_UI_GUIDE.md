# 🎯 Northflank Deployment - Manual UI Guide

> **Step-by-step guide with screenshots and UI instructions**

---

## 📋 Prerequisites

- ✅ Northflank account (create at https://northflank.com)
- ✅ Git repository connected
- ✅ LIFF ID: `2008934197-jM9Zoogn`
- ✅ Database & Redis already configured
- ⚠️ Need: Gemini API key (optional), LINE Channel Secret, JWT Secret

---

## 🚀 Part 1: Initial Setup (5 minutes)

### 1.1 Create Northflank Account

1. Go to https://northflank.com
2. Click **"Sign Up"**
3. Use GitHub/GitLab/Email
4. Verify email

### 1.2 Create Project

1. Click **"Create Project"**
2. Project name: `tree-bank`
3. Description: `Thailand Government Tree Bank System`
4. Region: `asia-southeast1` (Singapore - closest to Thailand)
5. Click **"Create"**

### 1.3 Connect Git Repository

1. In project, click **"Connect Repository"**
2. Choose your Git provider (GitHub/GitLab/Bitbucket)
3. Authorize Northflank
4. Select: `line-liff-v2-starter`
5. Click **"Connect"**

---

## 🔐 Part 2: Create Secrets (5 minutes)

### 2.1 Navigate to Secrets

1. In project sidebar, click **"Secrets"**
2. Click **"Create Secret"**

### 2.2 Create JWT Secret

1. **Name:** `jwt-secret`
2. **Value:** (generate with command below)
   ```bash
   openssl rand -base64 32
   # Or use: https://randomkeygen.com/
   ```
3. Click **"Create"**

### 2.3 Create LINE Channel Secret

1. Get from LINE Developers Console:
   - https://developers.line.biz/console/
   - Select your provider
   - Go to **"Channel settings"**
   - Copy **"Channel secret"**

2. In Northflank:
   - **Name:** `line-channel-secret`
   - **Value:** (paste LINE channel secret)
   - Click **"Create"**

### 2.4 Create Gemini API Key (Optional)

1. Get from Google AI Studio:
   - https://ai.google.dev/
   - Click **"Get API key"**
   - Copy the key

2. In Northflank:
   - **Name:** `gemini-api-key`
   - **Value:** (paste Gemini key)
   - Click **"Create"**

**✅ Secrets created! Now ready to deploy.**

---

## 🔧 Part 3: Deploy Backend (10 minutes)

### 3.1 Create Backend Service

1. Click **"Create Service"** → **"Deployment"**
2. Configure:

**Basic Info:**
- **Name:** `tree-bank-backend`
- **Type:** Deployment
- **Source:** Git Repository
- **Repository:** `line-liff-v2-starter`
- **Branch:** `main` (or your branch)

**Build Settings:**
- **Build Type:** Dockerfile
- **Dockerfile Path:** `backend/Dockerfile`
- **Build Context:** `backend`

**Port Settings:**
- **Port:** `8080`
- **Protocol:** HTTP
- **Public:** ✅ Enabled (check this!)

Click **"Continue"**

### 3.2 Configure Environment Variables

Add these environment variables:

**Plain Variables:**

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `8080` |
| `DATABASE_URL` | `postgresql://_140015aa6d48cb43:_fb59a0b931a1b7e2e5f72b0a917f0c@primary.liff-db--q4wt5c4d9mvq.addon.code.run:28996/_83707e411701?sslmode=require` |
| `REDIS_URL` | `rediss://default:808027dc8dbb883958e01a0cd3366578@master.liff-cache--q4wt5c4d9mvq.addon.code.run:6379` |
| `REDIS_TLS` | `true` |
| `REDIS_SNI` | `master.liff-cache--q4wt5c4d9mvq.addon.code.run` |
| `LIFF_ID` | `2008934197-jM9Zoogn` |

**Secret Variables:**

| Key | Secret Reference |
|-----|------------------|
| `JWT_SECRET` | `jwt-secret` |
| `LINE_CHANNEL_SECRET` | `line-channel-secret` |
| `GEMINI_API_KEY` | `gemini-api-key` |

Click **"Create Deployment"**

### 3.3 Wait for Build

- Build progress will show in real-time
- Typically takes 2-3 minutes
- Watch for "Build successful" ✅

### 3.4 Get Backend URL

1. Go to service **"tree-bank-backend"**
2. Click **"Domains"** tab
3. Copy the URL (e.g., `https://tree-bank-backend-xxxxx.northflank.app`)
4. **Save this URL** - you'll need it for frontend!

### 3.5 Test Backend

```bash
# Replace with your actual backend URL
curl https://tree-bank-backend-xxxxx.northflank.app/health

# Should return:
# {"status":"OK","database":"connected","redis":"connected"}
```

**✅ Backend deployed!**

---

## 🎨 Part 4: Deploy Frontend (10 minutes)

### 4.1 Create Frontend Service

1. Click **"Create Service"** → **"Deployment"**
2. Configure:

**Basic Info:**
- **Name:** `tree-bank-frontend`
- **Type:** Deployment
- **Source:** Git Repository
- **Repository:** `line-liff-v2-starter`
- **Branch:** `main`

**Build Settings:**
- **Build Type:** Dockerfile
- **Dockerfile Path:** `src/line/Dockerfile`
- **Build Context:** `src/line`

**Port Settings:**
- **Port:** `80`
- **Protocol:** HTTP
- **Public:** ✅ Enabled

Click **"Continue"**

### 4.2 Configure Build Arguments

**IMPORTANT:** These are **Build Arguments**, not Environment Variables!

In the **"Build Arguments"** section (not Environment Variables):

| Key | Value |
|-----|-------|
| `VITE_LIFF_ID` | `2008934197-jM9Zoogn` |
| `VITE_API_URL` | `https://tree-bank-backend-xxxxx.northflank.app` (your backend URL) |
| `VITE_GEMINI_API_KEY` | (your Gemini key, or reference secret `gemini-api-key`) |

**Note:** Vite environment variables must be set at **build time**, not runtime!

Click **"Create Deployment"**

### 4.3 Wait for Build

- Build typically takes 3-4 minutes
- Nginx layer is very fast
- Watch for "Deployment successful" ✅

### 4.4 Get Frontend URL

1. Go to service **"tree-bank-frontend"**
2. Click **"Domains"** tab
3. Copy the URL (e.g., `https://tree-bank-frontend-xxxxx.northflank.app`)
4. **Save this URL** - this is your LIFF endpoint!

### 4.5 Test Frontend

Open in browser:
```
https://tree-bank-frontend-xxxxx.northflank.app
```

Should show:
- ✅ Loading screen (briefly)
- ✅ Login screen (beautiful green design)
- ✅ No errors in browser console

**✅ Frontend deployed!**

---

## 🔄 Part 5: Update CORS & LIFF (5 minutes)

### 5.1 Update Backend CORS

1. Go to **tree-bank-backend** service
2. Click **"Environment"** tab
3. Add new variable:
   - **Key:** `FRONTEND_URL`
   - **Value:** `https://tree-bank-frontend-xxxxx.northflank.app`
4. Click **"Save"**
5. Service will auto-redeploy

### 5.2 Update LIFF Endpoint URL

**This is CRITICAL for the app to work in LINE!**

1. Go to [LINE Developers Console](https://developers.line.biz/console/)
2. Select your **Provider**
3. Click on LIFF app (ID: `2008934197-jM9Zoogn`)
4. Click **"Edit"**
5. Update **Endpoint URL** to:
   ```
   https://tree-bank-frontend-xxxxx.northflank.app
   ```
   ⚠️ **No trailing slash!**
6. Click **"Update"**

**✅ LIFF configured!**

---

## 🧪 Part 6: Testing (5 minutes)

### 6.1 Test Backend Health

```bash
curl https://tree-bank-backend-xxxxx.northflank.app/health
```

Expected:
```json
{
  "status": "OK",
  "timestamp": "2026-02-02T...",
  "database": "connected",
  "redis": "connected",
  "version": "1.0.0"
}
```

### 6.2 Test Frontend in Browser

```
https://tree-bank-frontend-xxxxx.northflank.app
```

Should see:
- ✅ Green login screen
- ✅ "ธนาคารต้นไม้" header
- ✅ "เข้าสู่ระบบด้วย LINE" button

### 6.3 Test in LINE App 🎉

**Send yourself this URL in LINE:**
```
https://liff.line.me/2008934197-jM9Zoogn
```

**Or create QR Code:**
1. Go to https://www.qrcode-monkey.com/
2. Enter URL: `https://liff.line.me/2008934197-jM9Zoogn`
3. Generate QR
4. Scan with LINE app

**Expected behavior:**
1. ✅ App opens in LINE
2. ✅ Auto-login (no login screen needed)
3. ✅ See your LINE profile in header
4. ✅ Map tab shows demo data
5. ✅ Can add trees via GPS
6. ✅ All features work!

**🎊 SUCCESS! Your app is LIVE!**

---

## 📊 Part 7: Initialize Database (5 minutes)

### 7.1 Access Backend Terminal

1. Go to **tree-bank-backend** service
2. Click **"Terminal"** tab (or "Console")
3. Click **"Start terminal"**

### 7.2 Run Database Migration

In the terminal:

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Verify tables created
npx prisma db execute --stdin <<EOF
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';
EOF
```

### 7.3 Optional: Seed Sample Data

```bash
# If you create a seed script
npx prisma db seed
```

**✅ Database initialized!**

---

## 🎯 Part 8: Verification Checklist

### ✅ Backend Checks

- [ ] Service is **"Running"** (green status)
- [ ] Health endpoint returns OK
- [ ] `/api` endpoint returns API info
- [ ] Logs show "Connected to PostgreSQL"
- [ ] Logs show "Connected to Redis"
- [ ] No error messages in logs

### ✅ Frontend Checks

- [ ] Service is **"Running"**
- [ ] Opens in browser without errors
- [ ] Shows login screen (when not in LINE)
- [ ] CSS/styling loads correctly
- [ ] No 404 errors for assets

### ✅ Integration Checks

- [ ] LIFF endpoint updated in LINE Console
- [ ] CORS configured (FRONTEND_URL set in backend)
- [ ] Frontend can call backend API
- [ ] No CORS errors in browser console

### ✅ LINE App Checks

- [ ] Opens in LINE app via LIFF URL
- [ ] Auto-login works
- [ ] LINE profile displays
- [ ] GPS permission can be granted
- [ ] Can add tree via GPS
- [ ] Can view trees on map
- [ ] Carbon calculation works
- [ ] AI analysis works (if Gemini key set)
- [ ] Can logout

---

## 🔧 Troubleshooting Common Issues

### Issue 1: Frontend Build Fails

**Error:** "VITE_LIFF_ID is not defined"

**Solution:**
- Make sure you added **Build Arguments**, not Environment Variables
- Build args must be set at build time for Vite
- Rebuild the service after adding build args

### Issue 2: Backend Can't Connect to Database

**Error:** "Connection refused" or "SSL error"

**Solution:**
- Check DATABASE_URL is correct
- Ensure `sslmode=require` is in connection string
- Verify network access in PostgreSQL addon settings

### Issue 3: CORS Error

**Error:** "Access-Control-Allow-Origin" in browser console

**Solution:**
- Check FRONTEND_URL is set in backend
- Make sure URL includes `https://`
- No trailing slash
- Redeploy backend after updating

### Issue 4: LIFF Not Loading in LINE

**Error:** Blank screen or "LIFF init failed"

**Solution:**
- Verify LIFF Endpoint URL matches frontend URL exactly
- No trailing slash in endpoint
- Wait 2-3 minutes after updating endpoint
- Clear LINE app cache (reopen app)

### Issue 5: Redis Connection Fails

**Error:** "Redis client error"

**Solution:**
- Check REDIS_URL is correct
- Ensure REDIS_TLS=true
- Verify REDIS_SNI matches your Redis hostname
- Check if Redis addon is running

---

## 📱 Mobile Testing Guide

### Test on iOS

1. Open LINE app on iPhone
2. Send LIFF URL to yourself
3. Click the link
4. Grant location permission when prompted
5. Test all features

### Test on Android

1. Open LINE app on Android
2. Send LIFF URL to yourself
3. Click the link
4. Grant location permission
5. Test all features

### Common Mobile Issues

**GPS not working:**
- Make sure location services enabled
- Grant permission to LINE app
- Try toggling location services off/on

**App not opening:**
- Clear LINE app cache
- Update LINE app to latest version
- Check LIFF endpoint URL is correct

---

## 🎬 Demo Preparation

### 1 Day Before Demo

- [ ] Verify all services are running
- [ ] Test on iOS device
- [ ] Test on Android device
- [ ] Prepare demo device (charge phone!)
- [ ] Bookmark LIFF URL in LINE
- [ ] Take backup screenshots
- [ ] Record backup video

### Demo Day Checklist

- [ ] Services running (check Northflank)
- [ ] Phone charged
- [ ] Stable internet
- [ ] LIFF URL ready
- [ ] Practiced demo flow
- [ ] Backup plan ready

---

## 📈 Monitoring in Northflank

### Real-Time Metrics

1. Go to service
2. Click **"Metrics"** tab
3. View:
   - CPU usage
   - Memory usage
   - Network traffic
   - Request count
   - Response time

### Logs

1. Click **"Logs"** tab
2. Filter by:
   - Time range
   - Log level (info, warn, error)
   - Search text

### Alerts

1. Click **"Alerts"** in sidebar
2. Create alert:
   - **Trigger:** CPU > 80%
   - **Action:** Email notification
   - **Cooldown:** 5 minutes

---

## 🔄 Updating the App

### Auto-Deploy Setup

1. Go to service settings
2. Enable **"Auto-deploy on push"**
3. Select branch: `main`
4. Every `git push` will trigger deployment!

### Manual Deployment

1. Go to service
2. Click **"Trigger Build"**
3. Select commit/branch
4. Click **"Build"**

### Rollback

1. Go to **"Deployments"** tab
2. Find previous working version
3. Click **"⋮"** menu
4. Select **"Rollback"**

---

## 💡 Pro Tips

### Tip 1: Use Service Links

Instead of hardcoding backend URL in frontend:

1. In frontend build args, use:
   ```
   VITE_API_URL=${backend.url}
   ```
2. Northflank auto-resolves to backend URL
3. No manual updates needed!

### Tip 2: Preview Environments

Create preview for each PR:
1. Settings → Enable "Preview deployments"
2. Each PR gets unique URL
3. Test before merging!

### Tip 3: Scheduled Jobs

For cron jobs (e.g., daily carbon calculation):
1. Create **"Job"** service
2. Set schedule: `0 0 * * *` (midnight daily)
3. Runs automatically!

### Tip 4: Health Check Path

Both services have `/health` endpoint:
- Northflank uses this to verify service is healthy
- If health check fails, service auto-restarts
- Prevents downtime!

---

## 📊 Cost Estimation

### Free Tier (Perfect for Demo!)

**What you get FREE:**
- 2 services (frontend + backend) ✅
- 0.2 vCPU per service
- 512 MB RAM per service
- Unlimited builds
- SSL certificates
- Custom domains
- Monitoring & logs

**Your PostgreSQL & Redis:**
- Already provided (not counted in Northflank)
- No additional cost!

**Total cost for demo: $0** 🎉

### Scaling Costs

When you need more resources:

| Resources | Cost/Month |
|-----------|------------|
| 0.2 vCPU, 512 MB | $0 (free) |
| 0.5 vCPU, 1 GB | ~$15 |
| 1 vCPU, 2 GB | ~$30 |
| 2 vCPU, 4 GB | ~$60 |

**Recommendation:** Start free, upgrade after pilot testing (week 4-5)

---

## 🎯 Quick Command Reference

```bash
# Install Northflank CLI
npm install -g @northflank/cli

# Login
northflank login

# List services
northflank service list

# View logs
northflank service logs tree-bank-frontend --follow

# Restart service
northflank service restart tree-bank-backend

# Update env var
northflank service env set tree-bank-frontend VITE_API_URL=https://new-url.com

# Trigger build
northflank service build tree-bank-frontend

# Scale
northflank service scale tree-bank-backend --replicas 2
```

---

## 📝 Deployment Summary Template

Fill this after deployment:

```
========================================
🌳 Tree Bank Deployment Summary
========================================

Deployment Date: __________
Deployed By: __________

URLs:
├─ Frontend: https://tree-bank-frontend-_____.northflank.app
├─ Backend:  https://tree-bank-backend-_____.northflank.app
└─ LIFF URL: https://liff.line.me/2008934197-jM9Zoogn

Services:
├─ Frontend: Running ✅
├─ Backend:  Running ✅
├─ Database: Connected ✅
└─ Redis:    Connected ✅

Secrets Configured:
├─ JWT Secret:           ✅
├─ LINE Channel Secret:  ✅
└─ Gemini API Key:       ✅

LIFF Configuration:
├─ Endpoint URL: https://tree-bank-frontend-_____.northflank.app
└─ Updated in LINE Console: ✅

Testing:
├─ Backend health check: ✅
├─ Frontend loads:       ✅
├─ LIFF opens in LINE:   ✅
├─ Auto-login works:     ✅
└─ All features work:    ✅

Status: ✅ READY FOR DEMO
========================================
```

---

## 🎊 Success!

Your Tree Bank LINE Mini App is now:

✅ **Deployed to Northflank**
✅ **Connected to PostgreSQL & Redis**
✅ **Accessible via LINE**
✅ **Production-ready**
✅ **Scalable**
✅ **Monitored**
✅ **FREE (for demo tier)**

**Next:** Test thoroughly and prepare your demo presentation!

---

## 📞 Need Help?

- **Northflank Docs:** https://northflank.com/docs
- **Northflank Discord:** https://discord.gg/northflank
- **Northflank Support:** support@northflank.com
- **Your Docs:** See `NORTHFLANK_DEPLOYMENT.md` (complete technical guide)

---

**LIFF URL (Share this in LINE to test):**
```
https://liff.line.me/2008934197-jM9Zoogn
```

**🌳 Happy deploying! Good luck with your demo! 🚀**
