# 🚂 Railway Quick Deploy Reference

## Project Info
- **Project**: thailand-tree-bank
- **URL**: https://railway.com/project/2e0e5bc3-e63f-4b4f-ab8b-c4968f2e143e
- **Region**: asia-southeast1

## ⚡ Quick Setup (3 Minutes)

### 1. Add Databases (Railway Dashboard)
```
+ New → Database → PostgreSQL  ✓
+ New → Database → Redis       ✓
```

### 2. Set Backend Variables
```env
JWT_SECRET=<generate-with-openssl-rand-base64-32>
LINE_CHANNEL_SECRET=<from-line-developers>
GEMINI_API_KEY=<optional>
NODE_ENV=production
```

### 3. Configure Backend Service
- Settings → Build → Select "Dockerfile" ✓
- Settings → Networking → Generate Domain ✓

### 4. Deploy Frontend
```bash
cd frontend
railway up --service <create-new>
```

### 5. Set Frontend Variables
```env
VITE_LIFF_ID=<from-line-developers>
VITE_API_URL=<backend-domain-from-step-3>
VITE_OPENROUTER_API_KEY=<optional>
VITE_GEMINI_API_KEY=<optional>
```

### 6. Configure Frontend Service
- Settings → Build → Select "Dockerfile" ✓
- Settings → Networking → Generate Domain ✓

## 🔑 Required Secrets

| Variable | Where to Get | Priority |
|----------|--------------|----------|
| `VITE_LIFF_ID` | LINE Developers Console → LIFF Apps | 🔴 Required |
| `LINE_CHANNEL_SECRET` | LINE Developers Console → Channel Settings | 🔴 Required |
| `JWT_SECRET` | Generate: `openssl rand -base64 32` | 🔴 Required |
| `VITE_API_URL` | From Railway backend domain | 🔴 Required |
| `GEMINI_API_KEY` | Google AI Studio | 🟡 Optional |
| `VITE_OPENROUTER_API_KEY` | OpenRouter.ai | 🟡 Optional |

## ✅ Verification

```bash
# Check backend
curl https://<backend-domain>.railway.app/health

# Check services
railway service status --all

# View logs
railway logs --service thailand-tree-bank
```

## 📝 Post-Deployment

1. Update LIFF Endpoint URL in LINE Console to your frontend domain
2. Run database migrations:
   ```bash
   railway run --service thailand-tree-bank npx prisma migrate deploy
   ```
3. Test LIFF app: `https://liff.line.me/<YOUR_LIFF_ID>`

---

**Full Guide**: See [RAILWAY_DEPLOYMENT_GUIDE.md](./RAILWAY_DEPLOYMENT_GUIDE.md)
