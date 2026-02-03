import React, { useState } from 'react';
import { Map as MapIcon, Leaf, BarChart3, Wand2, Plus, UploadCloud, FileText, CheckCircle, AlertCircle, X, Locate, Eye, Image as ImageIcon, LogOut, User, Settings } from 'lucide-react';
import { Plot, Tree, TreeType, TreeStatus, CARBON_CREDIT_FACTOR, PlotDocument } from './types';
import PlotMap from './components/PlotMap';
import TreeFormModal from './components/TreeFormModal';
import SettingsModal from './components/SettingsModal';
import { analyzePlot } from './services/openrouterService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useLiff } from './hooks/useLiff';
import { raiToSqm } from './utils/landUnits';

// Initial plot centered in Chiang Mai (Sample Data)
const INITIAL_PLOT: Plot = {
  id: 'p1',
  name: 'แปลง A - สวนป่าโซนเหนือ',
  location: '18.7883° N, 98.9853° E',
  centerLat: 18.7883,
  centerLng: 98.9853,
  areaRai: 5,
  areaNgan: 2,
  areaWa: 50,
  areaSqm: raiToSqm(5, 2, 50), // 9,000 sqm
  boundary: [
    { lat: 18.7886, lng: 98.9850 },
    { lat: 18.7886, lng: 98.9856 },
    { lat: 18.7880, lng: 98.9856 },
    { lat: 18.7880, lng: 98.9850 }
  ],
  trees: [
    { id: '1', lat: 18.7883, lng: 98.9853, type: TreeType.TEAK, status: TreeStatus.HEALTHY, plantedDate: '2023-01-15' },
    { id: '2', lat: 18.7884, lng: 98.9854, type: TreeType.TEAK, status: TreeStatus.HEALTHY, plantedDate: '2023-01-15' },
    { id: '3', lat: 18.7882, lng: 98.9852, type: TreeType.TEAK, status: TreeStatus.DAMAGED, plantedDate: '2023-01-15' },
    { id: '4', lat: 18.7885, lng: 98.9851, type: TreeType.RUBBER, status: TreeStatus.HEALTHY, plantedDate: '2023-06-01' },
    { id: '5', lat: 18.7881, lng: 98.9855, type: TreeType.RUBBER, status: TreeStatus.DEAD, plantedDate: '2023-06-01' },
  ],
  documents: [
    {
      id: 'd1',
      name: 'โฉนดที่ดิน_ฉบับจริง.jpg',
      size: '2.4 MB',
      type: 'image',
      uploadDate: '2023-01-10',
      status: 'verified',
      url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800'
    }
  ],
  status: 'active',
  createdAt: '2024-01-10T10:00:00Z',
  updatedAt: '2024-02-01T15:30:00Z'
};

function App() {
  // LIFF Integration
  const { isLoggedIn, profile, error: liffError, isLoading: liffLoading, login, logout } = useLiff();

  const [activeTab, setActiveTab] = useState<'map' | 'list' | 'stats' | 'ai'>('map');
  const [plot, setPlot] = useState<Plot>(INITIAL_PLOT);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Modals state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showTreeModal, setShowTreeModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [viewingDoc, setViewingDoc] = useState<PlotDocument | null>(null);
  const [tempTreeData, setTempTreeData] = useState<Partial<Tree>>({});
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Show loading screen while LIFF initializes
  if (liffLoading) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 items-center justify-center text-white relative overflow-hidden">
        {/* Animated background circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-teal-400/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        {/* Tree icon with pulsing animation */}
        <div className="mb-8 relative z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative bg-white/10 p-8 rounded-full backdrop-blur-sm">
              <Leaf size={64} className="text-white animate-bounce" style={{animationDuration: '2s'}} />
            </div>
          </div>
        </div>

        {/* Loading spinner */}
        <div className="relative mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/30 border-t-white"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-white/20"></div>
        </div>

        {/* Text */}
        <div className="text-center relative z-10">
          <p className="text-2xl font-bold mb-2 animate-pulse">กำลังโหลด...</p>
          <p className="text-emerald-100">เตรียมระบบธนาคารต้นไม้</p>
        </div>
      </div>
    );
  }

  // Show error if LIFF failed
  if (liffError) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-red-50 to-orange-50 items-center justify-center p-6">
        {/* Error icon with animation */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-red-400/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-red-100 to-orange-100 p-6 rounded-full">
            <AlertCircle size={64} className="text-red-500" />
          </div>
        </div>

        {/* Error message */}
        <h2 className="text-2xl font-bold text-red-900 mb-3">เกิดข้อผิดพลาด</h2>
        <p className="text-red-700 mb-6 max-w-md text-center">{liffError.message}</p>

        {/* Troubleshooting card */}
        <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-6 mb-6 max-w-md w-full">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText size={20} className="text-red-500" />
            วิธีแก้ไข
          </h3>
          <div className="space-y-3 text-sm text-gray-700">
            {[
              'ตรวจสอบว่าตั้งค่า LIFF ID ถูกต้อง',
              'ตรวจสอบว่าเปิดแอปผ่าน LINE',
              'ลองรีเฟรชหน้าเว็บ'
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  {i + 1}
                </div>
                <p className="pt-0.5">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Reload button */}
        <button
          onClick={() => window.location.reload()}
          className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-4 rounded-2xl hover:shadow-2xl font-bold transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <span>โหลดใหม่</span>
          <span className="text-xl">↻</span>
        </button>
      </div>
    );
  }

  // Show login screen if not logged in
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 items-center justify-center p-6 text-white relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-teal-400/20 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative z-10 max-w-md w-full">
          {/* Logo & Title Section */}
          <div className="text-center mb-12 animate-fade-in">
            {/* Decorative tree illustration */}
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-white/20 to-white/5 p-6 rounded-3xl backdrop-blur-xl border border-white/30 shadow-2xl">
                <div className="flex items-center justify-center">
                  <Leaf size={80} className="text-white drop-shadow-2xl" />
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-5xl font-bold mb-3 drop-shadow-lg">
              ธนาคารต้นไม้
            </h1>
            <div className="inline-block bg-white/10 backdrop-blur px-6 py-2 rounded-full border border-white/20 mb-2">
              <p className="text-emerald-50 text-lg font-medium">ระบบบริหารจัดการคาร์บอนเครดิต</p>
            </div>
            <p className="text-emerald-200 text-sm mt-3">Thailand Government Tree Bank System</p>
          </div>

          {/* Login Card */}
          <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl animate-slide-up">
            <div className="text-center mb-6">
              <p className="text-white text-lg mb-2">
                เข้าสู่ระบบผ่าน LINE
              </p>
              <p className="text-emerald-100 text-sm">
                ปลอดภัย • รวดเร็ว • ใช้งานง่าย
              </p>
            </div>

            {/* LINE Login Button */}
            <button
              onClick={login}
              className="group w-full bg-gradient-to-r from-white to-emerald-50 text-emerald-700 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:scale-105 active:scale-95"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="group-hover:scale-110 transition-transform">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
              </svg>
              <span>เข้าสู่ระบบด้วย LINE</span>
            </button>

            {/* Features list */}
            <div className="mt-8 space-y-3">
              {[
                { icon: '🌳', text: 'บันทึกและติดตามต้นไม้' },
                { icon: '📊', text: 'คำนวณคาร์บอนเครดิต' },
                { icon: '🤖', text: 'วิเคราะห์ด้วย AI' }
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-white/80 text-sm animate-fade-in" style={{animationDelay: `${i * 0.1}s`}}>
                  <span className="text-xl">{feature.icon}</span>
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Terms */}
            <p className="text-xs text-emerald-100 mt-6 text-center leading-relaxed">
              โดยการเข้าสู่ระบบ คุณยอมรับ
              <br />
              <span className="underline">ข้อกำหนดการใช้งาน</span> และ <span className="underline">นโยบายความเป็นส่วนตัว</span>
            </p>
          </div>

          {/* Thai Gov Badge */}
          <div className="text-center mt-6 animate-fade-in" style={{animationDelay: '0.5s'}}>
            <div className="inline-block bg-white/5 backdrop-blur px-4 py-2 rounded-full border border-white/10">
              <p className="text-xs text-emerald-100">🇹🇭 ระบบภาครัฐไทย • Thai Government System</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Event handlers (keep existing code)
  const handleMapClick = (lat: number, lng: number) => {
    setTempTreeData({ lat, lng });
    setModalMode('add');
    setShowTreeModal(true);
  };

  const handleEditTreeRequest = (treeId: string) => {
    const treeToEdit = plot.trees.find(t => t.id === treeId);
    if (treeToEdit) {
      setTempTreeData(treeToEdit);
      setModalMode('edit');
      setShowTreeModal(true);
    }
  };

  const handleGPSAdd = () => {
    setIsLoadingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setTempTreeData({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsLoadingLocation(false);
          setModalMode('add');
          setShowTreeModal(true);
        },
        (error) => {
          console.error("Error getting location", error);
          setIsLoadingLocation(false);
          alert("ไม่สามารถระบุตำแหน่งได้ กรุณาตรวจสอบการอนุญาตใช้งาน GPS");
        },
        { enableHighAccuracy: true }
      );
    } else {
      setIsLoadingLocation(false);
      alert("เบราว์เซอร์ของคุณไม่รองรับการระบุตำแหน่ง");
    }
  };

  const handleModalSave = (treeData: Partial<Tree>) => {
    if (modalMode === 'edit' && treeData.id) {
       setPlot(prev => ({
         ...prev,
         trees: prev.trees.map(t => t.id === treeData.id ? { ...t, ...treeData } as Tree : t)
       }));
    } else {
       const existingIds = plot.trees.map(t => parseInt(t.id)).filter(n => !isNaN(n));
       const nextId = existingIds.length > 0 ? (Math.max(...existingIds) + 1).toString() : '1';

       const newTree: Tree = {
         id: nextId,
         lat: treeData.lat || 0,
         lng: treeData.lng || 0,
         type: treeData.type || TreeType.TEAK,
         status: treeData.status || TreeStatus.HEALTHY,
         plantedDate: treeData.plantedDate || new Date().toISOString().split('T')[0]
       };

       setPlot(prev => ({ ...prev, trees: [...prev.trees, newTree] }));
    }
  };

  const handleQuickStatusUpdate = (updatedTree: Tree) => {
    setPlot(prev => ({
      ...prev,
      trees: prev.trees.map(t => t.id === updatedTree.id ? updatedTree : t)
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isImage = file.type.startsWith('image/');
      const newDoc: PlotDocument = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        type: file.name.endsWith('kmz') ? 'kmz' : file.name.endsWith('kml') ? 'kml' : isImage ? 'image' : 'pdf',
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'processing',
        url: isImage ? URL.createObjectURL(file) : undefined
      };

      setPlot(prev => ({...prev, documents: [newDoc, ...prev.documents]}));
      setShowUploadModal(false);

      setTimeout(() => {
        setPlot(prev => ({
          ...prev,
          documents: prev.documents.map(d => d.id === newDoc.id ? {...d, status: 'verified'} : d)
        }));
      }, 3000);
    }
  };

  const triggerAnalysis = async () => {
    setIsAnalyzing(true);
    setAiAnalysis('');
    const result = await analyzePlot(plot);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  const totalTrees = plot.trees.length;
  const healthyCount = plot.trees.filter(t => t.status === TreeStatus.HEALTHY).length;
  const currentCarbon = healthyCount * CARBON_CREDIT_FACTOR;

  const statusData = [
    { name: 'สมบูรณ์', value: healthyCount, color: '#22c55e' },
    { name: 'มีปัญหา', value: totalTrees - healthyCount, color: '#ef4444' },
  ];

  // Check if running in demo mode
  const isDemoMode = !import.meta.env.VITE_LIFF_ID;

  return (
    <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto shadow-2xl overflow-hidden relative border-x border-gray-200 font-sans">

      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 text-center text-sm font-medium shadow-lg z-30 animate-pulse">
          <div className="flex items-center justify-center gap-2">
            <AlertCircle size={16} />
            <span>โหมดทดสอบ (Demo Mode) - ตั้งค่า VITE_LIFF_ID เพื่อใช้งานจริง</span>
          </div>
        </div>
      )}

      {/* Updated Header with LIFF profile */}
      <header className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white p-4 pt-8 shadow-lg z-20 relative">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-32 h-32 bg-white/10 rounded-full blur-2xl -top-16 -right-16"></div>
          <div className="absolute w-24 h-24 bg-white/5 rounded-full blur-xl -bottom-12 -left-12"></div>
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              {profile?.pictureUrl && (
                <div className="relative">
                  <div className="absolute inset-0 bg-white/40 rounded-full blur-md"></div>
                  <img
                    src={profile.pictureUrl}
                    alt={profile.displayName}
                    className="relative w-14 h-14 rounded-full border-3 border-white shadow-xl object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold drop-shadow-md">ธนาคารต้นไม้</h1>
                <p className="text-emerald-100 text-sm">สวัสดี, {profile?.displayName || 'ผู้ใช้งาน'}</p>
              </div>
            </div>
            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-3 hover:bg-white/20 rounded-xl transition-all duration-300 backdrop-blur-sm hover:scale-110 active:scale-95"
              title="ตั้งค่า"
            >
              <Settings size={22} />
            </button>
          </div>

          {/* Plot info and carbon stats */}
          <div className="flex justify-between items-end bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="flex-1">
              <p className="text-emerald-100 text-xs flex items-center gap-1.5 mb-1">
                <MapIcon size={14} /> แปลงที่เลือก
              </p>
              <p className="font-semibold text-base">{plot.name}</p>
            </div>
            <div className="text-right">
               <div className="text-3xl font-bold drop-shadow-lg">{currentCarbon.toFixed(1)}</div>
               <div className="text-xs text-emerald-100 uppercase tracking-wider">กก. คาร์บอน/ปี</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area - Keep existing code */}
      <main className="flex-1 overflow-y-auto no-scrollbar relative pb-20 bg-gray-100">

        {/* VIEW: MAP */}
        {activeTab === 'map' && (
          <div className="h-full flex flex-col relative">
             <div className="absolute top-4 left-4 right-4 z-[400] flex gap-2">
                <div className="bg-white/95 backdrop-blur p-2 rounded-lg shadow-sm border border-gray-200 text-xs flex-1">
                   <span className="font-bold block text-gray-700">พิกัดดาวเทียมแม่นยำสูง</span>
                   <span className="text-emerald-600">ความคลาดเคลื่อน: ±2ม.</span>
                </div>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-white/95 backdrop-blur p-2 rounded-lg shadow-sm border border-gray-200 text-emerald-700 flex flex-col items-center justify-center w-12 hover:bg-emerald-50 active:bg-emerald-100"
                >
                   <UploadCloud size={18} />
                </button>
             </div>

             <div className="absolute bottom-6 right-4 z-[400]">
                <button
                  onClick={handleGPSAdd}
                  disabled={isLoadingLocation}
                  className="bg-white text-emerald-800 p-4 rounded-full shadow-xl border border-gray-100 hover:bg-gray-50 active:scale-95 transition-all flex items-center gap-2 font-bold"
                >
                  {isLoadingLocation ? (
                    <span className="animate-spin rounded-full h-5 w-5 border-2 border-emerald-500 border-t-transparent"></span>
                  ) : (
                    <Locate size={24} />
                  )}
                  {isLoadingLocation ? 'กำลังระบุ...' : 'ปักหมุดที่นี่'}
                </button>
             </div>

             <div className="flex-1 w-full h-full">
               <PlotMap
                 centerLat={plot.centerLat}
                 centerLng={plot.centerLng}
                 trees={plot.trees}
                 boundary={plot.boundary}
                 onAddTree={handleMapClick}
                 onUpdateTree={handleQuickStatusUpdate}
                 onEditTree={handleEditTreeRequest}
               />
             </div>
          </div>
        )}

        {/* VIEW: LIST */}
        {activeTab === 'list' && (
          <div className="p-4 space-y-4">
             {/* Documents Section */}
             <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
               <div className="flex justify-between items-center mb-3">
                 <h2 className="font-semibold text-gray-700 flex items-center gap-2">
                   <FileText size={18} /> เอกสารแปลงที่ดิน
                 </h2>
                 <button
                    onClick={() => setShowUploadModal(true)}
                    className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium"
                 >
                   + เพิ่ม
                 </button>
               </div>
               <div className="space-y-2">
                 {plot.documents.map(doc => (
                   <div
                    key={doc.id}
                    onClick={() => doc.type === 'image' && setViewingDoc(doc)}
                    className={`flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-100 ${doc.type === 'image' ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                   >
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded text-blue-600 relative overflow-hidden w-10 h-10 flex items-center justify-center shrink-0">
                          {doc.type === 'image' && doc.url ? (
                            <img src={doc.url} alt={doc.name} className="absolute inset-0 w-full h-full object-cover" />
                          ) : (
                             doc.type === 'image' ? <ImageIcon size={16} /> : <FileText size={16} />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-800 truncate max-w-[150px]">{doc.name}</div>
                          <div className="text-[10px] text-gray-400">{doc.uploadDate} • {doc.size}</div>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        {doc.type === 'image' && <Eye size={14} className="text-gray-400" />}
                        {doc.status === 'verified' && <CheckCircle size={16} className="text-green-500" />}
                        {doc.status === 'processing' && <span className="animate-pulse w-3 h-3 bg-yellow-400 rounded-full inline-block" />}
                        {doc.status === 'error' && <AlertCircle size={16} className="text-red-500" />}
                      </div>
                   </div>
                 ))}
                 {plot.documents.length === 0 && <div className="text-xs text-gray-400 text-center py-2">ยังไม่มีเอกสาร</div>}
               </div>
             </div>

             {/* Trees Section */}
             <div>
               <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold text-gray-700">ทะเบียนต้นไม้</h2>
                  <span className="text-xs text-gray-500">ลงทะเบียนแล้ว {totalTrees} ต้น</span>
               </div>
               <div className="space-y-2">
                {plot.trees.map(tree => (
                  <div key={tree.id}
                       onClick={() => handleEditTreeRequest(tree.id)}
                       className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center active:bg-gray-50 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-10 rounded-full ${tree.status === TreeStatus.HEALTHY ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div>
                          <h4 className="font-medium text-gray-800">
                             {tree.type === TreeType.TEAK ? 'สัก (Teak)' :
                              tree.type === TreeType.MAHOGANY ? 'ยางนา (Mahogany)' :
                              tree.type === TreeType.RUBBER ? 'ยางพารา (Rubber)' : 'อื่นๆ'}
                             <span className="text-gray-400 text-xs ml-2">#{tree.id}</span>
                          </h4>
                          <p className="text-xs text-gray-400 font-mono">
                            {tree.lat.toFixed(5)}, {tree.lng.toFixed(5)}
                          </p>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-md text-xs font-medium ${
                        tree.status === TreeStatus.HEALTHY
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {tree.status === TreeStatus.HEALTHY ? 'สมบูรณ์' :
                         tree.status === TreeStatus.DAMAGED ? 'เสียหาย' :
                         tree.status === TreeStatus.DEAD ? 'ตาย' : 'สูญหาย'}
                      </div>
                  </div>
                ))}
               </div>
             </div>
          </div>
        )}

        {/* VIEW: STATS */}
        {activeTab === 'stats' && (
          <div className="p-4 space-y-6">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-2xl p-6 text-white shadow-lg">
              <p className="text-emerald-100 text-sm mb-1">มูลค่าคาร์บอนเครดิตโดยประมาณ</p>
              <h2 className="text-3xl font-bold mb-2">{(currentCarbon * 300).toLocaleString()} บาท</h2>
              <p className="text-xs opacity-80">คำนวณจากราคาตลาดกลางสำหรับ {currentCarbon.toFixed(1)} กก./ปี</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-gray-700 font-semibold mb-4">สัดส่วนสุขภาพต้นไม้</h3>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={60} tick={{fontSize: 12}} />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

             <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
               <h3 className="text-gray-700 font-semibold mb-2">สูตรคำนวณเครดิต</h3>
               <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg font-mono">
                 {healthyCount} ต้น × 9.5 กก. = <span className="text-emerald-600 font-bold">{currentCarbon.toFixed(1)} กก.</span>
               </div>
               <p className="text-xs text-gray-400 mt-2">เฉพาะต้นไม้ที่สมบูรณ์เท่านั้นที่จะถูกนำมาคำนวณตามมาตรฐานภาครัฐ</p>
             </div>
          </div>
        )}

        {/* VIEW: AI ANALYSIS */}
        {activeTab === 'ai' && (
          <div className="p-4 space-y-4">
             <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 text-center">
                <Wand2 size={32} className="mx-auto text-indigo-500 mb-2" />
                <h3 className="font-semibold text-indigo-900 mb-1">AI ผู้ช่วยตรวจสอบแปลง</h3>
                <p className="text-xs text-indigo-700 mb-4">
                  วิเคราะห์โครงสร้างแปลง เอกสารสิทธิ์ และอัตราการรอดตาย เพื่อเพิ่มโอกาสในการออกพันธบัตรคาร์บอน
                </p>
                <button
                  onClick={triggerAnalysis}
                  disabled={isAnalyzing}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 w-full"
                >
                  {isAnalyzing ? 'กำลังวิเคราะห์...' : 'สร้างรายงานวิเคราะห์'}
                </button>
             </div>

             {aiAnalysis && (
               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 animate-fade-in">
                 <h4 className="font-bold text-gray-800 mb-3 border-b pb-2">ผลการวิเคราะห์โดย AI</h4>
                 <div className="prose prose-sm text-gray-600 whitespace-pre-line leading-relaxed text-sm">
                   {aiAnalysis}
                 </div>
               </div>
             )}
          </div>
        )}
      </main>

      {/* Tree Form Modal */}
      <TreeFormModal
        isOpen={showTreeModal}
        onClose={() => setShowTreeModal(false)}
        onSave={handleModalSave}
        initialData={tempTreeData}
        mode={modalMode}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        profile={profile}
        onLogout={logout}
      />

      {/* Upload Modal Overlay */}
      {showUploadModal && (
        <div className="absolute inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center">
           <div className="bg-white w-full sm:w-11/12 sm:rounded-2xl rounded-t-2xl p-6 animate-slide-up">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">อัปโหลดเอกสาร</h3>
                <button onClick={() => setShowUploadModal(false)} className="p-1 hover:bg-gray-100 rounded-full">
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="border-2 border-dashed border-emerald-300 bg-emerald-50/50 rounded-xl p-8 text-center mb-4 relative group">
                 <input
                   type="file"
                   onChange={handleFileUpload}
                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                   accept=".kml,.kmz,.jpg,.jpeg,.png,.pdf"
                 />
                 <UploadCloud className="mx-auto text-emerald-500 mb-3 group-hover:scale-110 transition-transform" size={40} />
                 <p className="text-emerald-900 font-medium">แตะเพื่อเลือกไฟล์</p>
                 <p className="text-xs text-emerald-600 mt-1">รองรับ KML, KMZ, PDF, รูปภาพ</p>
              </div>

              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                <p><strong>หมายเหตุ:</strong> ไฟล์ KML/KMZ จะถูกประมวลผลเพื่ออัปเดตขอบเขตที่ดินอัตโนมัติ รูปภาพจะถูกเก็บเป็นหลักฐานประกอบการขอเครดิต</p>
              </div>
           </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {viewingDoc && (
        <div
          className="fixed inset-0 z-[1100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setViewingDoc(null)}
        >
          <button className="absolute top-4 right-4 text-white/80 hover:text-white p-2">
            <X size={32} />
          </button>
          <div className="max-w-4xl max-h-full w-full h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
             <img
               src={viewingDoc.url}
               alt={viewingDoc.name}
               className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
             />
             <div className="mt-4 text-white text-center">
               <h3 className="font-bold text-lg">{viewingDoc.name}</h3>
               <p className="text-sm text-white/60">{viewingDoc.uploadDate}</p>
             </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center text-xs font-medium text-gray-400 z-30 pb-safe">
        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'map' ? 'text-emerald-700 font-bold' : 'hover:text-gray-600'}`}
        >
          <MapIcon size={24} strokeWidth={activeTab === 'map' ? 2.5 : 2} />
          แผนที่แปลง
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'list' ? 'text-emerald-700 font-bold' : 'hover:text-gray-600'}`}
        >
          <Leaf size={24} strokeWidth={activeTab === 'list' ? 2.5 : 2} />
          ต้นไม้
        </button>

        <div className="relative -top-5">
          <button
             onClick={() => setActiveTab('map')}
             className="bg-emerald-600 text-white p-4 rounded-full shadow-lg shadow-emerald-200 hover:scale-105 transition-transform"
          >
            <Plus size={24} />
          </button>
        </div>

        <button
          onClick={() => setActiveTab('stats')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'stats' ? 'text-emerald-700 font-bold' : 'hover:text-gray-600'}`}
        >
          <BarChart3 size={24} strokeWidth={activeTab === 'stats' ? 2.5 : 2} />
          สถิติ
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'ai' ? 'text-indigo-600 font-bold' : 'hover:text-gray-600'}`}
        >
          <Wand2 size={24} strokeWidth={activeTab === 'ai' ? 2.5 : 2} />
          AI ผู้ช่วย
        </button>
      </nav>
    </div>
  );
}

export default App;
