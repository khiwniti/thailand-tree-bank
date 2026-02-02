# ✅ Northflank Deployment Checklist

Quick reference for deploying Thailand Tree Bank LINE Mini App

---

## 📝 Required Information

Before starting, gather:

- [ ] **LIFF ID:** `2008934197-jM9Zoogn`
- [ ] **LINE Channel Secret:** (from LINE Developers Console)
- [ ] **Gemini API Key:** (optional, for AI features)
- [ ] **GitHub Repo:** `https://github.com/khiwniti/CarbonPlot.git`

---

## 🚀 Step-by-Step Deployment

### 1. Create Northflank Project
- [ ] Log in to https://app.northflank.com
- [ ] Create project: `thailand-tree-bank`
- [ ] Select region: `asia-southeast1` (Singapore)

### 2. Add Database Addons
- [ ] Add PostgreSQL: `tree-bank-postgres` (v15, Starter plan)
- [ ] Add Redis: `tree-bank-redis` (v7, Starter plan)
- [ ] Save connection strings

### 3. Deploy Backend
- [ ] Create "Combined Service"
- [ ] Connect GitHub: `khiwniti/CarbonPlot`
- [ ] Branch: `master`
- [ ] Dockerfile: `/backend/Dockerfile`
- [ ] Build context: `/backend`
- [ ] Set environment variables (see below)
- [ ] Deploy and wait for success

### 4. Run Database Migrations
- [ ] Go to backend → Jobs → Create Job
- [ ] Command: `npx prisma migrate deploy`
- [ ] Run once
- [ ] Check logs for success

### 5. Deploy Frontend
- [ ] Create "Combined Service"
- [ ] Connect GitHub: `khiwniti/CarbonPlot`
- [ ] Branch: `master`
- [ ] Dockerfile: `/src/line/Dockerfile`
- [ ] Build context: `/src/line`
- [ ] Set build arguments (see below)
- [ ] Deploy and wait for success

### 6. Configure URLs
- [ ] Note backend URL: `https://tree-bank-backend-xxx.northflank.app`
- [ ] Note frontend URL: `https://tree-bank-frontend-xxx.northflank.app`
- [ ] Update backend `CORS_ORIGIN` with frontend URL
- [ ] Redeploy backend

### 7. Update LINE LIFF
- [ ] Go to LINE Developers Console
- [ ] Edit LIFF app: `2008934197-jM9Zoogn`
- [ ] Update Endpoint URL to frontend URL
- [ ] Save changes

### 8. Test Deployment
- [ ] Test backend health: `curl https://tree-bank-backend-xxx.northflank.app/health`
- [ ] Test frontend health: `curl https://tree-bank-frontend-xxx.northflank.app/health`
- [ ] Open frontend in browser
- [ ] Test in LINE app: `https://liff.line.me/2008934197-jM9Zoogn`

### 9. Enable Auto-Deploy
- [ ] Backend → Build Settings → Enable auto-deploy on push
- [ ] Frontend → Build Settings → Enable auto-deploy on push

### 10. Set Up Monitoring
- [ ] Configure alerts for downtime
- [ ] Set up log retention
- [ ] Monitor resource usage

---

## 🔑 Backend Environment Variables

```bash
DATABASE_URL=${postgresql://tree-bank-postgres:CONNECTION_STRING}
REDIS_URL=${redis://tree-bank-redis:CONNECTION_STRING}
JWT_SECRET=<generate-random-32-char-string>
LINE_CHANNEL_ID=2008934197
LINE_CHANNEL_SECRET=<from-line-console>
PORT=8080
NODE_ENV=production
CORS_ORIGIN=https://tree-bank-frontend-xxx.northflank.app
MAX_FILE_SIZE=10485760
UPLOAD_DIR=/app/uploads
GEMINI_API_KEY=<your-gemini-key>
```

---

## 🏗️ Frontend Build Arguments

```bash
VITE_LIFF_ID=2008934197-jM9Zoogn
VITE_GEMINI_API_KEY=<your-gemini-key>
VITE_API_URL=https://tree-bank-backend-xxx.northflank.app
```

---

## ⚠️ Important Notes

1. **Replace all `xxx` placeholders** with actual Northflank URLs
2. **JWT_SECRET must be 32+ characters** - use: `openssl rand -hex 32`
3. **Update CORS_ORIGIN** after frontend deployment
4. **Update LIFF endpoint** after frontend deployment
5. **Build arguments are baked into JS** - rebuild to change

---

## 🐛 Common Issues

| Problem | Solution |
|---------|----------|
| Frontend white screen | Check build arguments, verify VITE_API_URL |
| CORS errors | Update CORS_ORIGIN, restart backend |
| Database errors | Check DATABASE_URL, verify addon is running |
| LIFF endpoint warning | Update endpoint in LINE console |
| Map not showing | Verify public/images/ included in build |

---

## 📊 Estimated Time

- **Project setup:** 5 minutes
- **Database addons:** 5 minutes
- **Backend deployment:** 10 minutes
- **Frontend deployment:** 10 minutes
- **Testing & verification:** 10 minutes

**Total:** ~40 minutes for first deployment

---

## 💰 Estimated Cost (Monthly)

**Starter Setup:**
- Frontend: $8
- Backend: $15
- PostgreSQL: $10
- Redis: $5
- **Total: ~$38/month**

---

## 🎯 Success Criteria

- [ ] Backend health check returns 200 OK
- [ ] Frontend loads in browser
- [ ] No LIFF endpoint mismatch warning
- [ ] Login works in LINE app
- [ ] Map displays with markers
- [ ] Can add trees/plots
- [ ] AI analysis works (if Gemini configured)

---

## 📚 Resources

- Full Guide: `NORTHFLANK_DEPLOYMENT.md`
- Northflank Docs: https://northflank.com/docs
- LINE LIFF Docs: https://developers.line.biz/en/docs/liff/

---

**Ready to deploy? Start at Step 1!** ✅
