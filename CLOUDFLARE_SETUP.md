# Cloudflare Pages Setup Guide

## Environment Variables Configuration

### Required Environment Variables

Add these in your Cloudflare Pages dashboard:

1. **Go to Cloudflare Dashboard**
   - Navigate to: Workers & Pages → thailand-tree-bank → Settings → Environment variables

2. **Add Production Variables:**
   ```
   VITE_LIFF_ID=2008934197-jM9Zoogn
   VITE_API_URL=https://your-backend-api.com
   VITE_OPENROUTER_API_KEY=sk-or-v1-xxxxx (optional)
   VITE_GEMINI_API_KEY=AIzaSyxxxxx (optional)
   ```

3. **Preview/Development Variables (optional):**
   Same as above but for preview deployments

### Steps to Add Variables:

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Go to **Workers & Pages**
3. Select your **thailand-tree-bank** project
4. Click **Settings** tab
5. Scroll to **Environment variables**
6. Click **Add variables**
7. For each variable:
   - Click **Add variable**
   - Enter variable name (e.g., `VITE_LIFF_ID`)
   - Enter value
   - Select **Production** (or both Production and Preview)
   - Click **Save**

### Trigger Rebuild:

After adding variables, you need to rebuild:

**Option A: Via Dashboard**
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the three dots (⋯)
4. Click **Retry deployment**

**Option B: Via Git**
```bash
git commit --allow-empty -m "Trigger rebuild with env vars"
git push
```

### Verify Variables:

After rebuild completes:
1. Visit your site: https://b02bd34b.thailand-tree-bank.pages.dev/
2. Open browser console (F12)
3. Check for LIFF initialization messages
4. App should now load properly!

## Troubleshooting

### Still seeing errors?
- **Check variable names**: Must start with `VITE_` for Vite to expose them
- **Check deployment logs**: Look for build errors in Cloudflare dashboard
- **Clear cache**: Try incognito/private browsing mode
- **Check LIFF ID**: Verify it's correct in LINE Developers Console

### Testing locally:
```bash
cd frontend
cp .env.example .env.local
# Add your variables to .env.local
npm run dev
```

## Build Configuration

Your current build settings in Cloudflare Pages should be:

```
Build command: cd frontend && npm install && npm run build
Build output directory: frontend/dist
Root directory: /
Node version: 18 or later
```

## Security Notes

- ✅ `VITE_*` variables are safe to expose (they're baked into the client bundle)
- ⚠️ Never put sensitive backend secrets in `VITE_*` variables
- ⚠️ API keys for OpenRouter/Gemini are exposed to clients (this is normal for frontend apps)
- 🔒 For sensitive operations, always use your backend API with proper authentication

## Next Steps

After environment variables are configured:
1. ✅ LIFF will initialize properly
2. ✅ App will display login screen
3. ✅ Users can authenticate via LINE
4. ✅ Full app functionality will be available
