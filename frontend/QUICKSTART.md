# 🚀 Quick Start Guide - LINE Mini App MVP (Week 1)

> **Goal:** Get a working demo ready for presentation next week
> **Time:** 7 days
> **Team:** 2-3 developers

---

## 📋 Day-by-Day Breakdown

### Day 1: LIFF Integration Setup

#### Step 1: Create LIFF hooks

Create `src/line/hooks/useLiff.ts`:

```typescript
import { useState, useEffect } from 'react';
import liff from '@line/liff';

interface LiffProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

interface UseLiffReturn {
  isLoggedIn: boolean;
  profile: LiffProfile | null;
  error: Error | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

export const useLiff = (): UseLiffReturn => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<LiffProfile | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initLiff = async () => {
      try {
        const liffId = import.meta.env.VITE_LIFF_ID;

        if (!liffId) {
          throw new Error('LIFF ID not found. Please set VITE_LIFF_ID in .env.local');
        }

        await liff.init({ liffId });

        if (liff.isLoggedIn()) {
          setIsLoggedIn(true);
          const profileData = await liff.getProfile();
          setProfile(profileData);
        }

        setIsLoading(false);
      } catch (err) {
        console.error('LIFF initialization failed', err);
        setError(err as Error);
        setIsLoading(false);
      }
    };

    initLiff();
  }, []);

  const login = () => {
    liff.login();
  };

  const logout = () => {
    liff.logout();
    setIsLoggedIn(false);
    setProfile(null);
  };

  return { isLoggedIn, profile, error, isLoading, login, logout };
};
```

#### Step 2: Update `.env.local`

Create `src/line/.env.local`:

```env
VITE_LIFF_ID=your_liff_id_here
VITE_GEMINI_API_KEY=your_gemini_key_here
```

#### Step 3: Update `vite.config.ts`

```typescript
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'import.meta.env.VITE_LIFF_ID': JSON.stringify(env.VITE_LIFF_ID),
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
```

#### Step 4: Update `App.tsx` to use LIFF

Replace the beginning of `App.tsx`:

```typescript
import React, { useState } from 'react';
import { Map as MapIcon, Leaf, BarChart3, Wand2, Plus, UploadCloud, FileText, CheckCircle, AlertCircle, X, Locate, Eye, Image as ImageIcon, LogOut, User } from 'lucide-react';
import { Plot, Tree, TreeType, TreeStatus, CARBON_CREDIT_FACTOR, PlotDocument } from './types';
import PlotMap from './components/PlotMap';
import TreeFormModal from './components/TreeFormModal';
import { analyzePlot } from './services/geminiService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useLiff } from './hooks/useLiff';

// ... keep INITIAL_PLOT

function App() {
  const { isLoggedIn, profile, error: liffError, isLoading: liffLoading, login, logout } = useLiff();

  // ... keep existing state

  // Show loading screen while LIFF initializes
  if (liffLoading) {
    return (
      <div className="flex flex-col h-screen bg-emerald-700 items-center justify-center text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mb-4"></div>
        <p className="text-lg">กำลังโหลด...</p>
      </div>
    );
  }

  // Show error if LIFF failed
  if (liffError) {
    return (
      <div className="flex flex-col h-screen bg-red-50 items-center justify-center p-6 text-center">
        <AlertCircle size={64} className="text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-red-900 mb-2">เกิดข้อผิดพลาด</h2>
        <p className="text-red-700 mb-4">{liffError.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
        >
          โหลดใหม่
        </button>
      </div>
    );
  }

  // Show login screen if not logged in
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-emerald-600 to-teal-800 items-center justify-center p-6 text-white text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🌳 ธนาคารต้นไม้</h1>
          <p className="text-emerald-100 text-lg">ระบบบริหารจัดการคาร์บอนเครดิต</p>
        </div>
        <div className="bg-white/10 backdrop-blur p-8 rounded-2xl max-w-md">
          <p className="text-white/90 mb-6">เข้าสู่ระบบผ่าน LINE เพื่อเริ่มใช้งาน</p>
          <button
            onClick={login}
            className="w-full bg-white text-emerald-700 py-3 rounded-lg font-bold text-lg hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
            </svg>
            เข้าสู่ระบบด้วย LINE
          </button>
        </div>
      </div>
    );
  }

  // Main app (existing code)
  // ... (keep all the rest of the existing App code)

  return (
    <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto shadow-2xl overflow-hidden relative border-x border-gray-200 font-sans">

      {/* Updated Header with profile */}
      <header className="bg-emerald-700 text-white p-4 pt-8 shadow-md z-20">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            {profile?.pictureUrl && (
              <img
                src={profile.pictureUrl}
                alt={profile.displayName}
                className="w-10 h-10 rounded-full border-2 border-white"
              />
            )}
            <div>
              <h1 className="text-xl font-bold">ธนาคารต้นไม้</h1>
              <p className="text-emerald-100 text-xs">สวัสดี, {profile?.displayName}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-2 hover:bg-emerald-600 rounded-lg transition-colors"
            title="ออกจากระบบ"
          >
            <LogOut size={20} />
          </button>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-emerald-100 text-xs flex items-center gap-1">
              <MapIcon size={12} /> {plot.name}
            </p>
          </div>
          <div className="text-right">
             <div className="text-2xl font-bold">{currentCarbon.toFixed(1)}</div>
             <div className="text-[10px] text-emerald-100 uppercase tracking-wide">กก. คาร์บอน/ปี</div>
          </div>
        </div>
      </header>

      {/* Keep all the rest of the existing code */}
      {/* ... */}
    </div>
  );
}

export default App;
```

---

### Day 2: Thai Land Units

Create `src/line/utils/landUnits.ts`:

```typescript
/**
 * Thai Land Unit Conversions
 * 1 ไร่ (Rai) = 1,600 ตารางเมตร (sqm)
 * 1 งาน (Ngan) = 400 ตารางเมตร (sqm)
 * 1 ตารางวา (Wa) = 4 ตารางเมตร (sqm)
 */

export const RAI_TO_SQM = 1600;
export const NGAN_TO_SQM = 400;
export const WA_TO_SQM = 4;

export interface ThaiLandUnit {
  rai: number;
  ngan: number;
  wa: number;
}

/**
 * Convert Thai land units (ไร่-งาน-วา) to square meters
 */
export const raiToSqm = (rai: number, ngan: number = 0, wa: number = 0): number => {
  return (rai * RAI_TO_SQM) + (ngan * NGAN_TO_SQM) + (wa * WA_TO_SQM);
};

/**
 * Convert square meters to Thai land units (ไร่-งาน-วา)
 */
export const sqmToRai = (sqm: number): ThaiLandUnit => {
  const rai = Math.floor(sqm / RAI_TO_SQM);
  const remaining = sqm % RAI_TO_SQM;
  const ngan = Math.floor(remaining / NGAN_TO_SQM);
  const wa = Math.floor((remaining % NGAN_TO_SQM) / WA_TO_SQM);
  return { rai, ngan, wa };
};

/**
 * Format Thai land units as string
 * Example: 5 ไร่ 2 งาน 50 วา
 */
export const formatThaiLandUnit = (rai: number, ngan: number = 0, wa: number = 0): string => {
  const parts: string[] = [];
  if (rai > 0) parts.push(`${rai} ไร่`);
  if (ngan > 0) parts.push(`${ngan} งาน`);
  if (wa > 0) parts.push(`${wa} วา`);
  return parts.join(' ') || '0 ไร่';
};

/**
 * Format square meters with Thai units
 * Example: 9,000 ตร.ม. (5 ไร่ 2 งาน 50 วา)
 */
export const formatAreaWithThaiUnits = (sqm: number): string => {
  const { rai, ngan, wa } = sqmToRai(sqm);
  return `${sqm.toLocaleString()} ตร.ม. (${formatThaiLandUnit(rai, ngan, wa)})`;
};
```

Update `types.ts`:

```typescript
export interface Plot {
  id: string;
  name: string;
  location: string;
  centerLat: number;
  centerLng: number;
  areaRai: number;
  areaNgan?: number;        // ADD THIS
  areaWa?: number;          // ADD THIS
  areaSqm: number;          // ADD THIS - calculated from ไร่-งาน-วา
  boundary?: { lat: number; lng: number }[];
  trees: Tree[];
  documents: PlotDocument[];
  createdAt?: string;       // ADD THIS
  updatedAt?: string;       // ADD THIS
}
```

---

### Day 3: Settings Modal

Create `src/line/components/SettingsModal.tsx`:

```typescript
import React from 'react';
import { X, User, LogOut, Info } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    displayName: string;
    pictureUrl?: string;
    userId: string;
  } | null;
  onLogout: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, profile, onLogout }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:w-11/12 sm:max-w-md sm:rounded-2xl rounded-t-2xl p-6 animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">ตั้งค่า</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Profile Section */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-4">
            {profile?.pictureUrl && (
              <img
                src={profile.pictureUrl}
                alt={profile.displayName}
                className="w-16 h-16 rounded-full border-2 border-emerald-500"
              />
            )}
            <div>
              <h4 className="font-bold text-gray-800 text-lg">{profile?.displayName}</h4>
              <p className="text-xs text-gray-500 font-mono">ID: {profile?.userId.substring(0, 16)}...</p>
            </div>
          </div>
        </div>

        {/* App Info */}
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Info size={18} className="text-gray-600" />
            <h5 className="font-semibold text-gray-700">เกี่ยวกับแอป</h5>
          </div>
          <p className="text-sm text-gray-600 mb-1">
            <strong>เวอร์ชัน:</strong> 1.0.0 (MVP)
          </p>
          <p className="text-sm text-gray-600">
            <strong>ระบบ:</strong> ธนาคารต้นไม้ - ภาครัฐ
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={onLogout}
            className="w-full bg-red-50 text-red-700 py-3 rounded-lg font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={20} />
            ออกจากระบบ
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center mt-4">
          พัฒนาโดย AI Studio × Google Gemini
        </p>
      </div>
    </div>
  );
};

export default SettingsModal;
```

Add to `App.tsx`:

```typescript
import SettingsModal from './components/SettingsModal';

// In state
const [showSettingsModal, setShowSettingsModal] = useState(false);

// In header, add settings button:
<button
  onClick={() => setShowSettingsModal(true)}
  className="p-2 hover:bg-emerald-600 rounded-lg transition-colors"
>
  <User size={20} />
</button>

// Before closing </div>, add:
<SettingsModal
  isOpen={showSettingsModal}
  onClose={() => setShowSettingsModal(false)}
  profile={profile}
  onLogout={logout}
/>
```

---

### Day 4-5: Testing & Polish

#### Create test data generator

Create `src/line/data/mockData.ts`:

```typescript
import { Plot, Tree, TreeType, TreeStatus, PlotDocument } from '../types';

export const generateMockPlots = (count: number = 3): Plot[] => {
  const provinces = ['เชียงใหม่', 'เชียงราย', 'ลำพูน'];
  const treeTypes = [TreeType.TEAK, TreeType.RUBBER, TreeType.MAHOGANY];

  return Array.from({ length: count }, (_, i) => ({
    id: `p${i + 1}`,
    name: `แปลง ${String.fromCharCode(65 + i)} - ${provinces[i]}`,
    location: `${(18.7 + i * 0.1).toFixed(4)}° N, ${(98.9 + i * 0.05).toFixed(4)}° E`,
    centerLat: 18.7 + i * 0.1,
    centerLng: 98.9 + i * 0.05,
    areaRai: 5 + i * 2,
    areaNgan: 2,
    areaWa: 50,
    areaSqm: (5 + i * 2) * 1600 + 2 * 400 + 50 * 4,
    boundary: [
      { lat: 18.7 + i * 0.1 + 0.003, lng: 98.9 + i * 0.05 - 0.003 },
      { lat: 18.7 + i * 0.1 + 0.003, lng: 98.9 + i * 0.05 + 0.003 },
      { lat: 18.7 + i * 0.1 - 0.003, lng: 98.9 + i * 0.05 + 0.003 },
      { lat: 18.7 + i * 0.1 - 0.003, lng: 98.9 + i * 0.05 - 0.003 }
    ],
    trees: Array.from({ length: 10 + i * 5 }, (_, j) => ({
      id: `t${i}-${j}`,
      lat: 18.7 + i * 0.1 + (Math.random() - 0.5) * 0.005,
      lng: 98.9 + i * 0.05 + (Math.random() - 0.5) * 0.005,
      type: treeTypes[j % 3],
      status: Math.random() > 0.1 ? TreeStatus.HEALTHY : TreeStatus.DAMAGED,
      plantedDate: `2023-0${Math.ceil(Math.random() * 6)}-15`,
      dbhCm: 20 + Math.random() * 30,
      heightM: 5 + Math.random() * 10
    })),
    documents: [
      {
        id: `d${i}-1`,
        name: `โฉนดที่ดิน_${String.fromCharCode(65 + i)}.jpg`,
        size: '2.4 MB',
        type: 'image',
        uploadDate: '2024-01-10',
        status: 'verified',
        url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800'
      }
    ],
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-02-01T15:30:00Z'
  }));
};
```

---

### Day 6: Demo Preparation

#### Create demo script

Create `DEMO_SCRIPT.md`:

```markdown
# 🎬 Demo Script - ธนาคารต้นไม้ LINE Mini App

## 📱 Demo Flow (5-7 minutes)

### 1. เปิดแอป (30 seconds)
- แสดง LINE app
- เปิด Mini App จาก LINE OA
- แสดง splash screen
- LIFF authentication

### 2. หน้าแผนที่ (1 minute)
- แสดงแผนที่แปลงที่ดิน
- Zoom in/out
- แสดง boundary ของแปลง
- แสดง markers ของต้นไม้ (สีเขียว = สมบูรณ์, สีแดง = เสียหาย)
- คลิกที่ marker เพื่อดูรายละเอียด

### 3. ปักหมุดต้นไม้ใหม่ (2 minutes)
- คลิกปุ่ม "ปักหมุดที่นี่"
- GPS หาตำแหน่งปัจจุบัน
- เปิด Form Modal
- กรอกข้อมูล:
  - ชนิดไม้: สัก (Teak)
  - สถานะ: สมบูรณ์
  - วันที่ปลูก: วันนี้
  - DBH: 25.5 ซม.
  - ความสูง: 8 ม.
- บันทึก
- แสดงต้นไม้ใหม่บนแผนที่

### 4. หน้ารายการต้นไม้ (1 minute)
- Tab "ต้นไม้"
- แสดงรายการเอกสาร (โฉนดที่ดิน)
- แสดงรายการต้นไม้ทั้งหมด
- คลิกดูรายละเอียดต้นไม้
- แก้ไขสถานะ (เปลี่ยนจาก สมบูรณ์ → เสียหาย)

### 5. หน้าสถิติ (1 minute)
- Tab "สถิติ"
- แสดงมูลค่าคาร์บอนเครดิต (บาท)
- กราฟแท่งสัดส่วนสุขภาพต้นไม้
- สูตรคำนวณ: X ต้น × 9.5 กก. = Y กก./ปี

### 6. AI ผู้ช่วย (1 minute)
- Tab "AI ผู้ช่วย"
- คลิก "สร้างรายงานวิเคราะห์"
- รอ Gemini AI ประมวลผล
- แสดงผลการวิเคราะห์:
  - สุขภาพของแปลง
  - คำแนะนำ
  - การปรับปรุง

### 7. ตั้งค่า (30 seconds)
- เปิดเมนู Settings
- แสดง LINE Profile
- ข้อมูลแอป
- ปุ่ม Logout

## 🎯 Key Points to Emphasize

✅ **ใช้งานง่าย** - ไม่ต้องติดตั้งแอป เข้าผ่าน LINE ได้เลย
✅ **GPS แม่นยำ** - ระบุตำแหน่งต้นไม้ได้แม่นยำถึง ±2 เมตร
✅ **คำนวณคาร์บอนอัตโนมัติ** - ตามมาตรฐานภาครัฐ (9.5 กก./ต้น/ปี)
✅ **ภาษาไทยเต็มรูปแบบ** - UI ภาษาไทยทั้งหมด รองรับหน่วยไทย (ไร่-งาน-วา)
✅ **AI ช่วยวิเคราะห์** - Gemini AI วิเคราะห์แปลงและให้คำแนะนำ
✅ **เตรียมพร้อมออฟไลน์** - (Phase 2) ทำงานได้แม้ไม่มีสัญญาณ

## 📝 Q&A Preparation

**Q: ทำงานออฟไลน์ได้ไหม?**
A: กำลังพัฒนาใน Phase 2 (2-3 สัปดาห์ข้างหน้า) จะสามารถเก็บข้อมูลออฟไลน์และ sync เมื่อกลับมามีสัญญาณ

**Q: อัปโหลดโฉนดที่ดินได้ไหม?**
A: ได้ครับ รองรับรูปภาพ, PDF, KML, KMZ - Phase 2 จะมี OCR อ่านข้อความจากโฉนดอัตโนมัติ

**Q: ต้นทุนการใช้งาน?**
A: แอปฟรีสำหรับเกษตรกรและหน่วยงานภาครัฐ ค่าใช้จ่ายอยู่ที่ cloud hosting และ AI API (~20,000 บาท/เดือน)

**Q: รองรับกี่คน?**
A: ออกแบบให้รองรับได้หลักหมื่นผู้ใช้พร้อมกัน สามารถ scale ได้ตามต้องการ

**Q: ข้อมูลปลอดภัยไหม?**
A: ใช่ครับ มี LINE authentication, HTTPS encryption, และข้อมูลเก็บในประเทศไทย
```

---

### Day 7: Final Testing & Polish

#### Checklist

- [ ] ทดสอบบน LINE app (iOS + Android)
- [ ] ทดสอบ LIFF login/logout
- [ ] ทดสอบ GPS permission
- [ ] ทดสอบ Gemini AI (ตรวจสอบ API key)
- [ ] ตรวจสอบ UI ทุกหน้า
- [ ] ทดสอบ responsive design
- [ ] เตรียม demo data
- [ ] ซ้อมนำเสนอ
- [ ] เตรียม backup plan (ถ้า live demo มีปัญหา)

---

## 🚨 Common Issues & Solutions

### Issue 1: LIFF init failed
```
Solution: ตรวจสอบ LIFF ID ใน .env.local
Double-check ว่า LIFF endpoint URL ตรงกับ deployment URL
```

### Issue 2: Gemini AI ไม่ตอบ
```
Solution: ตรวจสอบ API key
ตรวจสอบ CORS settings
ใช้ mock response สำหรับ demo
```

### Issue 3: GPS ไม่ทำงาน
```
Solution: ตรวจสอบ browser permissions
ต้องใช้ HTTPS (LINE LIFF ใช้ HTTPS อยู่แล้ว)
Fallback: ให้กรอกพิกัดด้วยมือ
```

---

## ✅ Definition of Done

- [ ] แอปรันได้บน LINE app
- [ ] Login/Logout ทำงานถูกต้อง
- [ ] แสดง LINE profile ใน header
- [ ] ปักหมุดต้นไม้ใหม่ได้
- [ ] แก้ไขข้อมูลต้นไม้ได้
- [ ] คำนวณคาร์บอนถูกต้อง
- [ ] AI analysis ทำงานได้
- [ ] UI ภาษาไทยทั้งหมด
- [ ] รองรับหน่วยไทย (ไร่-งาน-วา)
- [ ] ไม่มี critical bugs
- [ ] Demo script พร้อมใช้

---

**Good luck! 🚀**
