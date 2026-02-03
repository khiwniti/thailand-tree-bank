# 🌳 ธนาคารต้นไม้ - LINE Mini App

> **Tree Bank Management System** - ระบบบริหารจัดการคาร์บอนเครดิตสำหรับภาครัฐ

LINE Mini App สำหรับจัดการแปลงต้นไม้ คำนวณคาร์บอนเครดิต และตรวจสอบด้วย AI

[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![LINE LIFF](https://img.shields.io/badge/LINE_LIFF-2.23.2-00B900?logo=line)](https://developers.line.biz/en/docs/liff/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?logo=vite)](https://vitejs.dev/)

---

## 🎯 ฟีเจอร์หลัก

- ✅ **LINE Authentication** - เข้าสู่ระบบผ่าน LINE อัตโนมัติ
- 🗺️ **GPS Tree Mapping** - ปักหมุดต้นไม้ด้วย GPS ความแม่นยำสูง (±2ม.)
- 📊 **Carbon Credit Calculation** - คำนวณคาร์บอนเครดิตอัตโนมัติ (9.5 กก./ต้น/ปี)
- 🤖 **AI Analysis** - วิเคราะห์แปลงด้วย Google Gemini AI
- 📁 **Document Management** - จัดเก็บโฉนดที่ดิน, ภาพถ่ายทางอากาศ, KML/KMZ
- 🇹🇭 **Thai Language & Units** - รองรับภาษาไทยและหน่วยไทย (ไร่-งาน-วา)
- 📱 **Mobile-First Design** - ออกแบบสำหรับมือถือเป็นหลัก
- 🎨 **Modern UI** - ใช้ Tailwind CSS และ Lucide Icons

---

## 🚀 Quick Start

### ข้อกำหนดเบื้องต้น

- Node.js >= 20.x
- npm >= 10.x
- LINE Developers Account
- Google Gemini API Key (optional for AI features)

### การติดตั้ง

```bash
# Clone repository
git clone https://github.com/line/line-liff-v2-starter.git
cd line-liff-v2-starter/src/line

# ติดตั้ง dependencies
npm install

# Copy environment file
cp .env.example .env.local

# แก้ไข .env.local ด้วย credentials ของคุณ
# VITE_LIFF_ID=your_liff_id_here
# VITE_GEMINI_API_KEY=your_gemini_api_key_here

# รันในโหมด development
npm run dev
```

แอปจะเปิดที่ `http://localhost:3000`

---

## 🔑 การตั้งค่า LIFF ID

### 1. สร้าง LIFF App

1. ไปที่ [LINE Developers Console](https://developers.line.biz/console/)
2. เลือก Provider หรือสร้างใหม่
3. คลิก **Create** → **LIFF app**
4. กรอกข้อมูล:
   - **LIFF app name:** ธนาคารต้นไม้
   - **Size:** Full
   - **Endpoint URL:** `https://your-domain.com` (หรือ ngrok URL สำหรับ dev)
   - **Scopes:** เลือก `profile` และ `openid`
5. คัดลอก **LIFF ID** (รูปแบบ: `xxxx-xxxxxxxx`)
6. วางใน `.env.local`

### 2. ทดสอบในเครื่อง (Local Testing)

ใช้ ngrok สำหรับทดสอบ LIFF ในเครื่อง:

```bash
# ติดตั้ง ngrok
npm install -g ngrok

# เปิด tunnel
ngrok http 3000

# คัดลอก HTTPS URL (เช่น https://abc123.ngrok.io)
# อัปเดต LIFF Endpoint URL ใน LINE Console
```

### 3. เปิดแอปใน LINE

ส่ง URL นี้ให้ตัวเองใน LINE:

```
https://liff.line.me/YOUR_LIFF_ID
```

หรือสร้าง QR Code:
- ไปที่ [QR Code Generator](https://www.qr-code-generator.com/)
- ใส่ URL: `https://liff.line.me/YOUR_LIFF_ID`
- สแกน QR Code ด้วย LINE app

---

## 🎨 Tech Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.2.4 | UI Framework |
| TypeScript | 5.8.2 | Type Safety |
| Vite | 6.2.0 | Build Tool |
| Tailwind CSS | 3.x | Styling |
| @line/liff | 2.23.2 | LINE Integration |
| Leaflet | 1.9.4 | Interactive Maps |
| Recharts | 3.7.0 | Charts & Graphs |
| Lucide React | 0.563.0 | Icons |
| Google Gemini | 1.38.0 | AI Analysis |

### Key Libraries

```json
{
  "@line/liff": "^2.23.2",
  "@google/genai": "^1.38.0",
  "leaflet": "1.9.4",
  "recharts": "^3.7.0",
  "lucide-react": "^0.563.0"
}
```

---

## 📁 โครงสร้างโปรเจค

```
src/line/
├── components/           # React components
│   ├── PlotMap.tsx      # Leaflet map component
│   ├── TreeFormModal.tsx # Tree CRUD form
│   └── SettingsModal.tsx # User settings
├── hooks/               # Custom React hooks
│   └── useLiff.ts       # LIFF authentication hook
├── services/            # External API services
│   └── geminiService.ts # Google Gemini AI
├── utils/               # Utility functions
│   └── landUnits.ts     # Thai land unit conversions
├── data/                # Mock data & generators
│   └── mockData.ts      # Demo data generator
├── types.ts             # TypeScript type definitions
├── App.tsx              # Main app component
├── index.tsx            # Entry point
├── vite.config.ts       # Vite configuration
└── .env.example         # Environment template
```

---

## 🎮 การใช้งาน

### 1. เข้าสู่ระบบ

- เปิดแอปผ่าน LINE (คลิก LIFF URL)
- ระบบจะ login อัตโนมัติด้วย LINE account
- แสดง profile และชื่อผู้ใช้ในหัวข้อ

### 2. ปักหมุดต้นไม้

**วิธีที่ 1: GPS อัตโนมัติ**
- คลิกปุ่ม **"ปักหมุดที่นี่"**
- อนุญาตการใช้งาน location
- ระบบจะระบุตำแหน่งปัจจุบัน (±2 เมตร)
- กรอกข้อมูลต้นไม้และบันทึก

**วิธีที่ 2: คลิกบนแผนที่**
- คลิกที่ตำแหน่งบนแผนที่
- กรอกข้อมูลต้นไม้และบันทึก

### 3. จัดการต้นไม้

- **ดูรายละเอียด:** คลิกที่ marker บนแผนที่
- **แก้ไข:** คลิกที่รายการในแท็บ "ต้นไม้"
- **อัปเดตสถานะ:** เปลี่ยนสถานะเป็น สมบูรณ์/เสียหาย/ตาย/สูญหาย

### 4. คำนวณคาร์บอน

- ไปที่แท็บ **"สถิติ"**
- ดูมูลค่าคาร์บอนเครดิต (บาท)
- ดูกราฟสัดส่วนสุขภาพต้นไม้
- ดูสูตรการคำนวณ: `ต้นสมบูรณ์ × 9.5 กก./ปี`

### 5. วิเคราะห์ด้วย AI

- ไปที่แท็บ **"AI ผู้ช่วย"**
- คลิก **"สร้างรายงานวิเคราะห์"**
- รอ Google Gemini ประมวลผล (~5-10 วินาที)
- ดูคำแนะนำและข้อเสนอแนะ

---

## 🔧 สคริปต์ที่ใช้งาน

```bash
# Development
npm run dev              # รัน dev server (port 3000)

# Build
npm run build            # Build สำหรับ production

# Preview
npm run preview          # ดู production build ในเครื่อง

# Type Check
npx tsc --noEmit         # ตรวจสอบ TypeScript errors

# Lint (if ESLint is configured)
npm run lint             # ตรวจสอบ code style
```

---

## 🚢 การ Deploy

### Option 1: Netlify (แนะนำ)

```bash
# ติดตั้ง Netlify CLI
npm install -g netlify-cli

# Build project
npm run build

# Deploy
netlify deploy --dir=dist --prod

# ตั้งค่า Environment Variables ใน Netlify Dashboard:
# VITE_LIFF_ID=your_liff_id
# VITE_GEMINI_API_KEY=your_gemini_key
```

### Option 2: Vercel

```bash
# ติดตั้ง Vercel CLI
npm install -g vercel

# Deploy
vercel

# ตั้งค่า Environment Variables ใน Vercel Dashboard
```

### Option 3: Manual Build

```bash
# Build
npm run build

# Upload dist/ folder to your hosting
# Make sure to set environment variables on your hosting platform
```

---

## 🌍 Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_LIFF_ID` | LINE LIFF ID จาก Developers Console | ✅ Yes | `2008934197-jM9Zoogn` |
| `VITE_GEMINI_API_KEY` | Google Gemini API Key | ⚠️ Optional | `AIza...` |

**หมายเหตุ:**
- ถ้าไม่ตั้งค่า `VITE_GEMINI_API_KEY` ฟีเจอร์ AI จะไม่ทำงาน
- ต้องใช้ `VITE_` prefix สำหรับ Vite environment variables

---

## 🧪 การทดสอบ

### Test Checklist

- [ ] LIFF Login ทำงาน (iOS + Android)
- [ ] แสดง LINE Profile ในหัวข้อ
- [ ] GPS permission granted
- [ ] ปักหมุดต้นไม้ด้วย GPS ได้
- [ ] คลิกบนแผนที่เพื่อเพิ่มต้นไม้ได้
- [ ] แก้ไขข้อมูลต้นไม้ได้
- [ ] คำนวณคาร์บอนถูกต้อง
- [ ] AI analysis ทำงาน (ถ้ามี API key)
- [ ] อัปโหลดเอกสารได้
- [ ] ดูรูปภาพได้
- [ ] Settings modal เปิดได้
- [ ] Logout ทำงาน
- [ ] ทำงานบนหน้าจอ mobile

### Browser Testing

เปิดได้ใน browser โดยตรง แต่:
- จะไม่มีการ auto-login (แสดงหน้า login)
- GPS ต้องใช้ HTTPS
- ฟีเจอร์บางอย่างต้องเปิดใน LINE app

---

## 🐛 Troubleshooting

### ❌ "LIFF ID not found"

**สาเหตุ:** ไม่ได้ตั้งค่า environment variable

**แก้ไข:**
```bash
# ตรวจสอบว่ามีไฟล์ .env.local
ls -la .env.local

# ตรวจสอบเนื้อหา
cat .env.local

# ต้องมี:
VITE_LIFF_ID=your_actual_liff_id
```

### ❌ GPS ไม่ทำงาน

**แก้ไข:**
- ตรวจสอบ browser/app permissions
- ต้องใช้ HTTPS (LIFF ใช้ HTTPS อัตโนมัติ)
- ทดสอบบนเครื่องจริง ไม่ใช่ emulator

### ❌ Gemini API ไม่ตอบสนอง

**แก้ไข:**
- ตรวจสอบ API key ถูกต้อง
- ตรวจสอบ quota ไม่เกิน (Free tier: 15 requests/min)
- ดู console log สำหรับ error details

### ❌ แผนที่ไม่แสดง

**แก้ไข:**
- ตรวจสอบ internet connection
- Clear browser cache
- ตรวจสอบ console สำหรับ Leaflet errors

---

## 📚 Documentation

- [LIFF Documentation](https://developers.line.biz/en/docs/liff/)
- [Google Gemini API](https://ai.google.dev/gemini-api/docs)
- [Leaflet Documentation](https://leafletjs.com/reference.html)
- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://react.dev/)

---

## 🗺️ Roadmap

### ✅ Phase 1: MVP (Week 1) - COMPLETE

- [x] LIFF Integration
- [x] GPS Tree Mapping
- [x] Carbon Calculation
- [x] AI Analysis
- [x] Thai Language UI
- [x] Settings Modal

### 🚧 Phase 2: Core Features (Week 2-4) - PLANNED

- [ ] Offline Mode (IndexedDB)
- [ ] Backend API (Node.js + PostgreSQL)
- [ ] Cloud Document Storage
- [ ] Registration Workflow

### 📅 Phase 3: Advanced Features (Week 5-10) - PLANNED

- [ ] OCR for Land Deeds (Thai)
- [ ] Aerial Photo Processing
- [ ] AI Tree Detection
- [ ] Multi-layer Growth Tracking
- [ ] KML/KMZ Import/Export

### 🔮 Phase 4: Integration (Week 11-12) - PLANNED

- [ ] Third-party Verification
- [ ] Government Dashboard
- [ ] QGIS/LING Maps Integration
- [ ] Data Migration Tools

---

## 👥 Contributing

This is a government project for Thailand Tree Bank. Contact the project team for contribution guidelines.

---

## 📄 License

Copyright © 2026 Thailand Tree Bank Project

---

## 🙏 Acknowledgments

- LINE Corporation for LIFF Platform
- Google for Gemini AI
- OpenStreetMap contributors
- Thai government forestry department

---

## 📞 Support

- **Technical Issues:** Check documentation or create an issue
- **LIFF Setup:** [LINE Developers Forum](https://www.line-community.me/)
- **Project Questions:** Contact project team

---

**Built with ❤️ for Thailand's Forest Conservation**

🌳 ปลูกต้นไม้วันนี้ เพื่ออากาศที่ดีในวันพรุ่งนี้
