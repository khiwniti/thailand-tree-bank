# 🎯 RAILWAY DEPLOYMENT - FINAL SOLUTION

## ⚠️ Current Situation

After extensive troubleshooting with Railway CLI uploads, the **definitive solution** is to:

**Connect Railway to GitHub** (not use CLI upload)

## Why GitHub Connection is Required

Railway CLI `railway up` has limitations:
- Creates snapshots that may exclude files
- Caching issues
- File upload inconsistencies
- Environment-dependent behavior

GitHub connection:
✅ Always pulls latest committed code
✅ All files guaranteed to be present
✅ Auto-deploys on push
✅ No caching issues
✅ Production-ready workflow

## 🚀 COMPLETE SETUP (5 Minutes)

### Step 1: Connect Backend to GitHub

1. Open: https://railway.com/project/2e0e5bc3-e63f-4b4f-ab8b-c4968f2e143e

2. Click **"thailand-tree-bank-backend"** service

3. **Settings** tab → **Source** section:
   - Click "Connect Repo" or "Disconnect" (if CLI source exists)
   - Select repository: `khiwniti/thailand-tree-bank`
   - **Root Directory**: `/backend`
   - **Branch**: `main`
   - Click "Connect"

4. **Settings** tab → **Build** section:
   - Builder: **"Dockerfile"**
   - Dockerfile Path: `Dockerfile`
   - Save

5. **Variables** tab → Add these:
   ```
   JWT_SECRET=<run: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))">
   LINE_CHANNEL_SECRET=<from LINE Developers Console>
   NODE_ENV=production
   ```

6. **Settings** → **Networking**:
   - Click "Generate Domain"
   - Copy the domain (you'll need it for frontend)

7. Click **"Deploy"** button

### Step 2: Connect Frontend to GitHub

1. Click **"thailand-tree-bank-frontend"** service

2. **Settings** tab → **Source** section:
   - Click "Connect Repo"
   - Select repository: `khiwniti/thailand-tree-bank`
   - **Root Directory**: `/frontend`
   - **Branch**: `main`
   - Click "Connect"

3. **Settings** tab → **Build** section:
   - Builder: **"Dockerfile"**
   - Dockerfile Path: `Dockerfile`
   - Build Arguments (optional):
     ```
     VITE_LIFF_ID=$VITE_LIFF_ID
     VITE_API_URL=$VITE_API_URL
     ```
   - Save

4. **Variables** tab → Add these:
   ```
   VITE_LIFF_ID=<from LINE Developers Console>
   VITE_API_URL=<backend-domain-from-step-1.6>
   ```

5. **Settings** → **Networking**:
   - Click "Generate Domain"
   - Copy the domain

6. Click **"Deploy"** button

### Step 3: Update Backend CORS

1. Go back to **backend service** → **Variables**

2. Add:
   ```
   FRONTEND_URL=<frontend-domain-from-step-2.5>
   ```

3. Redeploy backend

### Step 4: Run Database Migrations

After backend is deployed and running:

```bash
railway run --service thailand-tree-bank-backend npx prisma db push
```

Or in Railway dashboard:
- Backend service → Deployment → Open "Shell"
- Run: `npx prisma db push`

### Step 5: Update LIFF Settings

1. Go to: https://developers.line.biz/console/
2. Open your LIFF app
3. Update **Endpoint URL** to your frontend domain
4. Save

## ✅ Verification

### Test Backend
```bash
curl https://your-backend-domain.railway.app/health
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
Open in browser: `https://your-frontend-domain.railway.app`

### Test LIFF
Send in LINE: `https://liff.line.me/<YOUR_LIFF_ID>`

## 🔑 Quick Credentials Reference

### Generate JWT Secret (Node.js)
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Example output: `lHxTvd7FtUHJRR49cgoR0JeGIc3jRKk/+a2SRNVEjqA=`

### LINE Credentials

Get from: https://developers.line.biz/console/

**VITE_LIFF_ID**:
- Providers → Your Provider → LIFF → Your LIFF App → LIFF ID

**LINE_CHANNEL_SECRET**:
- Providers → Your Provider → Channels → Your Channel → Channel Secret

## 🎯 Why This Works

When connected to GitHub:
✅ Railway pulls code from git (all files present)
✅ package-lock.json available
✅ nginx.conf available
✅ prisma/schema.prisma available
✅ All dependencies correctly installed
✅ Builds succeed consistently

## 📊 Expected Result

After GitHub connection and configuration:

```
✅ Backend: RUNNING (with PostgreSQL + Redis)
✅ Frontend: RUNNING (serving React app)
✅ Auto-deploy: On every git push
✅ Domains: Generated and accessible
```

## 🔄 Future Workflow

After setup:
```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# Railway automatically:
# 1. Detects push
# 2. Builds both services
# 3. Deploys to production
# 4. Notifies you
```

## ⏱️ Estimated Time

- GitHub connection: 2 minutes
- Environment variables: 2 minutes
- First deployment: 3-4 minutes
- Total: **~10 minutes** to fully working app

## 🆘 If Issues Persist

After GitHub connection, if builds still fail:
1. Check build logs in Railway dashboard
2. Verify all env vars are set
3. Check Dockerfile path is correct
4. Ensure root directory is set (`/backend` or `/frontend`)

---

**TLDR**: Connect Railway to GitHub, set env vars via dashboard, deploy. Done! 🚀

**Dashboard**: https://railway.com/project/2e0e5bc3-e63f-4b4f-ab8b-c4968f2e143e
