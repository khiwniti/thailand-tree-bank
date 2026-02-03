# 🔗 Railway GitHub Integration Setup

## ⚠️ Current Issue

Railway is deploying from a **cached/stale version** of your code, not pulling the latest from GitHub.

**Symptoms:**
- Files exist in GitHub but not found during Railway build
- package-lock.json not found
- nginx.conf not found
- Old code being deployed

## ✅ Solution: Connect Railway to GitHub

### Step 1: Connect GitHub Repository

1. Open Railway dashboard: https://railway.com/project/2e0e5bc3-e63f-4b4f-ab8b-c4968f2e143e

2. **Backend Service:**
   - Click "thailand-tree-bank-backend"
   - Go to "Settings" tab
   - Scroll to "Source" section
   - Click "Connect Repo" or "Change Source"
   - Select: `khiwniti/thailand-tree-bank`
   - **Root Directory**: `/backend`
   - **Branch**: `main`
   - Click "Connect"

3. **Frontend Service:**
   - Click "thailand-tree-bank-frontend"
   - Go to "Settings" tab
   - Scroll to "Source" section
   - Click "Connect Repo"
   - Select: `khiwniti/thailand-tree-bank`
   - **Root Directory**: `/frontend`
   - **Branch**: `main`
   - Click "Connect"

### Step 2: Configure Builder (Both Services)

**Backend:**
- Settings → Build → Builder: **"Dockerfile"**
- Dockerfile Path: `Dockerfile`
- Save

**Frontend:**
- Settings → Build → Builder: **"Dockerfile"**
- Dockerfile Path: `Dockerfile`
- Save

### Step 3: Add Environment Variables

**Backend Variables:**
```env
JWT_SECRET=<run: openssl rand -base64 32>
LINE_CHANNEL_SECRET=<from LINE Developers Console>
NODE_ENV=production
GEMINI_API_KEY=<optional>
```

**Frontend Variables:**
```env
VITE_LIFF_ID=<from LINE Developers Console>
VITE_API_URL=${{thailand-tree-bank-backend.RAILWAY_PUBLIC_DOMAIN}}
VITE_OPENROUTER_API_KEY=<optional>
VITE_GEMINI_API_KEY=<optional>
```

### Step 4: Deploy

Click "Deploy" button on both services. Railway will:
1. Pull latest code from GitHub
2. Build using Dockerfile
3. Deploy to production

## 🎯 Benefits of GitHub Integration

✅ **Auto-deploy on push** - Every git push triggers deployment
✅ **Always latest code** - No stale cache issues
✅ **PR previews** - Test changes before merging
✅ **Rollback support** - Easy to revert to previous deploys
✅ **Branch deployments** - Deploy from different branches

## 🔄 After Setup

Every time you push to GitHub:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

Railway automatically:
1. Detects the push
2. Pulls latest code
3. Builds and deploys
4. Notifies you of status

## 🚀 Alternative: Deploy from CLI (Without GitHub)

If you prefer CLI deployment:

```bash
# Ensure Railway pulls latest
cd backend
railway up

cd ../frontend  
railway up
```

But GitHub integration is **highly recommended** for production!

## ✅ Verification

After connecting GitHub and redeploying:

**Check Backend:**
```bash
curl https://thailand-tree-bank-backend-production.up.railway.app/health
```

**Check Frontend:**
Open in browser: `https://thailand-tree-bank-frontend-production.up.railway.app`

## 📊 Current Git Status

✅ All files committed and pushed to GitHub
✅ Latest commit: "Fix .gitignore: Include package-lock.json for Railway builds"
✅ Repository: https://github.com/khiwniti/thailand-tree-bank

Railway just needs to **connect** to this repo!

---

**Setup Time**: 3 minutes
**Result**: Fully automated deployments 🚀
