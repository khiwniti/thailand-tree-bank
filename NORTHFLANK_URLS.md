# 🔗 Northflank Deployment URLs

## Your Deployed Services:

### Frontend (LIVE!)
```
https://p01--tree-bank-frontend--4pclzhv2j4k6.code.run
```

### Backend
Check Northflank dashboard → tree-bank-backend → Networking → Public URL

---

## 🔧 Fix LIFF ID Error NOW:

### Step 1: Add Build Arguments

1. **Go to:** https://app.northflank.com
2. **Click:** `tree-bank-frontend` service
3. **Click:** "Build Settings" tab
4. **Scroll to:** "Build Arguments" section
5. **Click:** "+ Add Argument" (3 times)

**Add these:**
```
VITE_LIFF_ID = 2008934197-jM9Zoogn
VITE_OPENROUTER_API_KEY = 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
VITE_API_URL = https://YOUR-BACKEND-URL.code.run
```

6. **Click:** "Save"

### Step 2: Rebuild

1. **Click:** "Builds" tab
2. **Click:** "Trigger Build"
3. **Wait:** ~3 minutes

---

## ✅ After Rebuild:

Visit: https://p01--tree-bank-frontend--4pclzhv2j4k6.code.run

You'll see:
- ✅ Beautiful glassmorphic UI
- ✅ No LIFF errors
- ✅ Login screen working
- ✅ All animations!

---

## 🔐 Update LINE LIFF:

https://developers.line.biz/console/
→ LIFF: 2008934197-jM9Zoogn
→ Endpoint URL: https://p01--tree-bank-frontend--4pclzhv2j4k6.code.run

---

**Do this now and the error will disappear!** 🚀
