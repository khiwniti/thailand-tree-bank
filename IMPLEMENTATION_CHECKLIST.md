# ✅ Implementation Checklist - Week 1 MVP

> **Goal:** Working LINE Mini App Demo in 7 days
> **Deadline:** [INSERT DATE]

---

## 📋 Pre-Development Setup

### Environment Setup

- [ ] **Create LINE Developers Account**
  - Go to https://developers.line.biz/
  - Create Provider (organization)
  - Note down Provider ID

- [ ] **Create LIFF App**
  - In LINE Developers Console → Create LIFF App
  - LIFF Endpoint URL: `https://your-domain.com` (or use ngrok for local testing)
  - Scopes: `profile`, `openid`
  - Copy LIFF ID (format: `xxxx-xxxxxxxx`)

- [ ] **Setup Development Environment**
  ```bash
  cd /home/user/line-liff-v2-starter/src/line
  npm install
  ```

- [ ] **Create `.env.local`**
  ```env
  VITE_LIFF_ID=your_liff_id_here
  VITE_GEMINI_API_KEY=your_gemini_api_key_here
  ```

- [ ] **Get Gemini API Key**
  - Go to https://ai.google.dev/gemini-api/docs
  - Get API key
  - Add to `.env.local`

---

## 👨‍💻 Day 1: LIFF Integration (Monday)

### Tasks

- [ ] **Create `hooks/useLiff.ts`**
  - Copy code from `QUICKSTART.md` → Day 1 → Step 1
  - Test: `npm run dev` → Check console for LIFF init

- [ ] **Update `vite.config.ts`**
  - Copy code from `QUICKSTART.md` → Day 1 → Step 3
  - Verify env vars are loaded correctly

- [ ] **Update `App.tsx`**
  - Import `useLiff` hook
  - Add loading screen
  - Add login screen
  - Add logout button in header
  - Test: Open in LINE app → Login should work

### Testing

```bash
# Run dev server
npm run dev

# Test in browser (should show login screen)
# Test in LINE app (should authenticate automatically)
```

### Acceptance Criteria

- [ ] App shows loading screen on init
- [ ] App shows login screen if not logged in
- [ ] "Login with LINE" button works
- [ ] App shows user profile after login
- [ ] Logout button works

---

## 🌏 Day 2: Thai UI & Land Units (Tuesday)

### Tasks

- [ ] **Create `utils/landUnits.ts`**
  - Copy code from `QUICKSTART.md` → Day 2
  - Add unit tests (optional)

- [ ] **Update `types.ts`**
  - Add `areaNgan`, `areaWa`, `areaSqm` to `Plot` interface
  - Add `createdAt`, `updatedAt` timestamps

- [ ] **Update Plot UI to show Thai units**
  - Import `formatAreaWithThaiUnits`
  - Display: "9,000 ตร.ม. (5 ไร่ 2 งาน 50 วา)"

- [ ] **Review all UI text**
  - Change any remaining English to Thai
  - Verify tree type labels are in Thai

### Testing

```typescript
// Test land unit conversion
import { raiToSqm, sqmToRai, formatAreaWithThaiUnits } from './utils/landUnits';

console.log(raiToSqm(5, 2, 50)); // Should be 9,000
console.log(sqmToRai(9000)); // Should be { rai: 5, ngan: 2, wa: 50 }
console.log(formatAreaWithThaiUnits(9000)); // "9,000 ตร.ม. (5 ไร่ 2 งาน 50 วา)"
```

### Acceptance Criteria

- [ ] All UI text is in Thai
- [ ] Land area shows Thai units
- [ ] Conversion formulas work correctly
- [ ] No English text visible in UI

---

## ⚙️ Day 3: Settings Modal (Wednesday)

### Tasks

- [ ] **Create `components/SettingsModal.tsx`**
  - Copy code from `QUICKSTART.md` → Day 3
  - Test modal open/close

- [ ] **Add Settings button to Header**
  - Import `User` icon from lucide-react
  - Add button next to logout
  - Wire up `showSettingsModal` state

- [ ] **Test Settings Modal**
  - Open modal
  - Verify profile displays correctly
  - Test logout from modal

### Acceptance Criteria

- [ ] Settings button in header works
- [ ] Modal shows user profile
- [ ] Modal shows app version info
- [ ] Logout from modal works
- [ ] Modal closes on X button or outside click

---

## 📊 Day 4: Demo Data & Polish (Thursday)

### Tasks

- [ ] **Create `data/mockData.ts`**
  - Copy code from `QUICKSTART.md` → Day 4-5
  - Generate 3 sample plots

- [ ] **Update INITIAL_PLOT**
  - Use mock data generator
  - Add variety of tree types and statuses

- [ ] **Polish UI**
  - Check spacing, alignment
  - Test on different screen sizes
  - Verify colors are consistent
  - Add loading states where needed

- [ ] **Test All Features**
  - Map view
  - Add tree via GPS
  - Add tree via map click
  - Edit tree
  - Document upload
  - AI analysis
  - Statistics view

### Acceptance Criteria

- [ ] Demo data looks realistic
- [ ] All tabs work without errors
- [ ] UI is polished and professional
- [ ] No console errors
- [ ] Works on mobile screen sizes

---

## 🎬 Day 5: Demo Preparation (Friday)

### Tasks

- [ ] **Create Demo Scenario**
  - Write step-by-step demo script
  - Practice demo flow (5-7 minutes)
  - Prepare backup screenshots/video

- [ ] **Prepare Presentation**
  - Create slides (Google Slides / PowerPoint)
  - Add screenshots of app
  - Include architecture diagram
  - Add timeline and budget

- [ ] **Test in Production-like Environment**
  - Deploy to Netlify/Vercel
  - Test on real LINE app (iOS + Android)
  - Verify LIFF works on actual LINE

### Demo Script

```markdown
1. Open LINE app
2. Go to LINE OA message
3. Click Mini App link
4. Show login screen → Login
5. Show profile in header
6. Navigate to Map tab
7. Click "ปักหมุดที่นี่" → Show GPS modal
8. Fill tree form → Save
9. Show new tree on map
10. Go to List tab → Show trees
11. Edit a tree → Change status
12. Go to Stats tab → Show carbon calculation
13. Go to AI tab → Run analysis
14. Open Settings → Show profile → Logout
```

### Acceptance Criteria

- [ ] Demo script ready
- [ ] Presentation slides complete
- [ ] App deployed and accessible via LINE
- [ ] Team has practiced demo
- [ ] Backup plan ready (video/screenshots)

---

## 🧪 Day 6: Testing & Bug Fixes (Saturday)

### Critical Tests

- [ ] **LIFF Integration**
  - [ ] Login works on iOS LINE app
  - [ ] Login works on Android LINE app
  - [ ] Profile displays correctly
  - [ ] Logout works properly

- [ ] **Core Features**
  - [ ] GPS permission granted
  - [ ] Add tree via GPS works
  - [ ] Add tree via map click works
  - [ ] Edit tree works
  - [ ] Delete tree works (if implemented)
  - [ ] Carbon calculation is correct

- [ ] **AI Integration**
  - [ ] Gemini API key works
  - [ ] Analysis generates results
  - [ ] Error handling for API failures

- [ ] **UI/UX**
  - [ ] All text is Thai
  - [ ] Responsive on mobile
  - [ ] No layout breaks
  - [ ] Icons render correctly

### Bug Tracking

Create a list of bugs found:

```markdown
## Bugs Found

1. [ ] BUG: GPS permission not working on iOS
   - Priority: HIGH
   - Fix: ...

2. [ ] BUG: Thai font too small on Android
   - Priority: MEDIUM
   - Fix: ...

3. [ ] BUG: AI analysis slow (>10 seconds)
   - Priority: LOW
   - Fix: Add loading indicator
```

### Acceptance Criteria

- [ ] All critical bugs fixed
- [ ] No blockers for demo
- [ ] App stable on iOS and Android
- [ ] Performance acceptable

---

## 🎯 Day 7: Final Polish & Rehearsal (Sunday)

### Final Tasks

- [ ] **Code Review**
  - [ ] Remove console.logs (or comment out)
  - [ ] Remove commented code
  - [ ] Check for TODO comments
  - [ ] Verify no hardcoded API keys in code

- [ ] **Performance Check**
  - [ ] App loads in < 3 seconds
  - [ ] Map renders smoothly
  - [ ] No memory leaks
  - [ ] Images optimized

- [ ] **Demo Rehearsal**
  - [ ] Full demo run (5-7 minutes)
  - [ ] Q&A preparation
  - [ ] Backup plan tested

- [ ] **Documentation**
  - [ ] README updated
  - [ ] CLAUDE.md updated (if needed)
  - [ ] Deployment instructions ready

### Pre-Demo Checklist

- [ ] App deployed to production URL
- [ ] LIFF endpoint URL matches deployment
- [ ] Environment variables set correctly
- [ ] SSL certificate valid (HTTPS working)
- [ ] Gemini API key has sufficient quota
- [ ] LINE OA configured and tested
- [ ] Demo device charged and ready
- [ ] Internet connection stable
- [ ] Backup screenshots/video ready
- [ ] Presentation slides loaded
- [ ] Team knows who presents what

### Acceptance Criteria

- [ ] Demo runs smoothly end-to-end
- [ ] Team confident in presentation
- [ ] All materials ready
- [ ] Backup plan in place

---

## 📱 Deployment Checklist

### Deploy to Netlify (Recommended for MVP)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy from src/line/
cd src/line
npm run build
netlify deploy --dir=dist --prod

# Note the URL, e.g., https://tree-bank-mvp.netlify.app
```

### Update LIFF Endpoint URL

1. Go to LINE Developers Console
2. Edit LIFF App
3. Update Endpoint URL to your Netlify URL
4. Save changes
5. Test in LINE app

### Alternative: Deploy to Vercel

```bash
npm install -g vercel
cd src/line
vercel
```

---

## 🐛 Common Issues & Solutions

### Issue: "LIFF ID not found"

**Cause:** `.env.local` not loaded or wrong variable name

**Solution:**
```typescript
// Check vite.config.ts has correct define:
define: {
  'import.meta.env.VITE_LIFF_ID': JSON.stringify(env.VITE_LIFF_ID),
}

// Check .env.local has:
VITE_LIFF_ID=your_actual_liff_id
```

### Issue: "CORS error when calling API"

**Cause:** API not allowing your domain

**Solution:**
```typescript
// Backend needs CORS headers:
app.use(cors({
  origin: 'https://your-liff-domain.com'
}));
```

### Issue: "GPS not working"

**Cause:** Requires HTTPS or user denied permission

**Solution:**
- LIFF apps automatically use HTTPS
- Ask user to grant permission
- Fallback: manual coordinate input

### Issue: "Gemini API quota exceeded"

**Cause:** Too many requests

**Solution:**
- Check API quota in Google AI Studio
- Implement rate limiting
- Use mock responses for demo

---

## 📞 Team Communication

### Daily Standup (15 minutes)

**Time:** 9:00 AM every day

**Format:**
1. What I did yesterday
2. What I'll do today
3. Any blockers?

### Communication Channels

- **Urgent:** LINE group chat
- **Code:** GitHub issues/PRs
- **Meetings:** Google Meet
- **Documentation:** Shared Google Doc

---

## ✅ Definition of Done (Week 1)

The demo is ready when:

- [x] App runs on LINE app (iOS + Android)
- [x] LIFF authentication works
- [x] User can login and see profile
- [x] User can add trees via GPS
- [x] User can view trees on map
- [x] User can see carbon credit calculation
- [x] AI analysis generates results
- [x] UI is 100% Thai language
- [x] No critical bugs
- [x] Demo script practiced
- [x] Presentation ready

---

## 🎊 Success Criteria

**Demo is successful if:**
1. App runs without crashes during demo
2. Stakeholders understand the value proposition
3. Positive feedback from audience
4. Approval to proceed with Phase 2

---

## 📚 Resources

- **LINE LIFF Docs:** https://developers.line.biz/en/docs/liff/
- **Gemini API Docs:** https://ai.google.dev/gemini-api/docs
- **Leaflet Docs:** https://leafletjs.com/
- **Project Plan:** `MIGRATION_PLAN.md`
- **Quick Start:** `src/line/QUICKSTART.md`
- **Thai Summary:** `EXECUTIVE_SUMMARY_TH.md`

---

**Let's build this! 💪🌳**

---

**Last Updated:** February 2, 2026
**Version:** 1.0
**Status:** Ready to Start ✅
