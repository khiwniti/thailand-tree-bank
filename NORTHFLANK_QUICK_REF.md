# 🎯 Northflank Deployment - Quick Reference Card

> **Print this or keep it handy during deployment!**

---

## ✅ Your Configuration

```
LIFF ID: 2008934197-jM9Zoogn
LIFF URL: https://liff.line.me/2008934197-jM9Zoogn

Database: primary.liff-db--q4wt5c4d9mvq.addon.code.run:28996
Redis: master.liff-cache--q4wt5c4d9mvq.addon.code.run:6379
```

---

## 🚀 Deployment Steps (30 minutes total)

### ⏱️ Part 1: Setup (5 min)
1. ✅ Create Northflank account → https://northflank.com
2. ✅ Create project: `tree-bank`
3. ✅ Connect Git repository

### ⏱️ Part 2: Secrets (5 min)
Create these secrets:
- `jwt-secret` → Generate: `openssl rand -base64 32`
- `line-channel-secret` → From LINE Console
- `gemini-api-key` → From https://ai.google.dev/

### ⏱️ Part 3: Backend (10 min)
1. Create **Deployment**
2. Name: `tree-bank-backend`
3. Dockerfile: `backend/Dockerfile`
4. Context: `backend`
5. Port: `8080` (public ✅)
6. Add env vars (see table below)
7. Deploy & copy URL

### ⏱️ Part 4: Frontend (10 min)
1. Create **Deployment**
2. Name: `tree-bank-frontend`
3. Dockerfile: `src/line/Dockerfile`
4. Context: `src/line`
5. Port: `80` (public ✅)
6. Add **Build Args** (see table below)
7. Deploy & copy URL

### ⏱️ Part 5: Configure (5 min)
1. Update backend: `FRONTEND_URL=<frontend-url>`
2. Update LIFF Endpoint in LINE Console
3. Test in LINE app!

---

## 📋 Environment Variables Cheat Sheet

### Backend (Environment Variables)

Copy-paste these in Northflank:

```
NODE_ENV=production
PORT=8080
DATABASE_URL=postgresql://_140015aa6d48cb43:_fb59a0b931a1b7e2e5f72b0a917f0c@primary.liff-db--q4wt5c4d9mvq.addon.code.run:28996/_83707e411701?sslmode=require
REDIS_URL=rediss://default:808027dc8dbb883958e01a0cd3366578@master.liff-cache--q4wt5c4d9mvq.addon.code.run:6379
REDIS_TLS=true
REDIS_SNI=master.liff-cache--q4wt5c4d9mvq.addon.code.run
LIFF_ID=2008934197-jM9Zoogn
JWT_SECRET=${secret.jwt-secret}
LINE_CHANNEL_SECRET=${secret.line-channel-secret}
GEMINI_API_KEY=${secret.gemini-api-key}
FRONTEND_URL=<will-add-after-frontend-deployed>
```

### Frontend (Build Arguments)

⚠️ **Important:** These go in **Build Arguments**, NOT Environment Variables!

```
VITE_LIFF_ID=2008934197-jM9Zoogn
VITE_API_URL=<backend-url-from-step-3>
VITE_GEMINI_API_KEY=${secret.gemini-api-key}
```

---

## 🧪 Testing Commands

```bash
# Backend health
curl https://<backend-url>/health

# Backend API info
curl https://<backend-url>/api

# Frontend (open in browser)
https://<frontend-url>

# LIFF URL (send in LINE)
https://liff.line.me/2008934197-jM9Zoogn
```

---

## 🎬 Demo URLs

**After deployment, you'll have:**

```
📱 App for Users (LINE):
   https://liff.line.me/2008934197-jM9Zoogn

🌐 Web Preview (Browser):
   https://tree-bank-frontend-xxxxx.northflank.app

🔧 API Endpoint:
   https://tree-bank-backend-xxxxx.northflank.app

📊 Northflank Dashboard:
   https://app.northflank.com/projects/tree-bank
```

---

## ⚡ Quick Fixes

### Frontend not loading?
1. Check Northflank logs
2. Verify build args were set
3. Rebuild service

### Backend errors?
1. Check database connection string
2. Verify Redis URL
3. Check logs for specific error

### LIFF not working?
1. Verify endpoint URL in LINE Console
2. Wait 2-3 minutes after update
3. Try in incognito/private mode

### GPS not working?
1. Must use HTTPS (auto-provided ✅)
2. Grant location permission
3. Test on real device, not emulator

---

## 🎯 Success Criteria

**Deployment is successful when:**

- [x] Backend returns `{"status":"OK"}` at `/health`
- [x] Frontend shows login screen in browser
- [x] LIFF opens in LINE app
- [x] Auto-login works
- [x] Can add tree via GPS
- [x] Carbon calculation displays
- [x] No errors in logs

**When all ✅, you're ready to demo!**

---

## 🆘 Emergency Contacts

**If deployment fails:**
1. Check logs first
2. Review error messages
3. Consult troubleshooting section
4. Contact Northflank support

**If demo day issues:**
1. Have backup screenshots ready
2. Have backup video ready
3. Can show local version (ngrok)

---

## 🏆 Final Checklist

Before demo:

- [ ] Services deployed and running
- [ ] Database initialized
- [ ] LIFF endpoint updated
- [ ] Tested on iOS
- [ ] Tested on Android
- [ ] All features working
- [ ] Logs clean (no errors)
- [ ] Metrics normal
- [ ] Demo flow practiced
- [ ] Backup plan ready

**When all ✅ → GO FOR DEMO! 🎉**

---

**Deployment Platform:** Northflank
**LIFF ID:** 2008934197-jM9Zoogn
**Status:** ✅ Ready to Deploy
**Time Needed:** ~30 minutes
**Difficulty:** ⭐⭐☆☆☆ Easy

**You got this! 🚀🌳**
