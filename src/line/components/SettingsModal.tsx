import React from 'react';
import { X, User, LogOut, Info, MapIcon } from 'lucide-react';

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
    <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in">
      <div className="bg-white w-full sm:w-11/12 sm:max-w-md sm:rounded-2xl rounded-t-2xl p-6 animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">ตั้งค่า</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Profile Section */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-4">
            {profile?.pictureUrl ? (
              <img
                src={profile.pictureUrl}
                alt={profile.displayName}
                className="w-16 h-16 rounded-full border-2 border-emerald-500"
              />
            ) : (
              <div className="w-16 h-16 rounded-full border-2 border-emerald-500 bg-emerald-100 flex items-center justify-center">
                <User size={32} className="text-emerald-600" />
              </div>
            )}
            <div className="flex-1">
              <h4 className="font-bold text-gray-800 text-lg">{profile?.displayName || 'ผู้ใช้งาน'}</h4>
              <p className="text-xs text-gray-500 font-mono mt-1">
                ID: {profile?.userId ? `${profile.userId.substring(0, 16)}...` : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* App Info */}
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Info size={18} className="text-gray-600" />
            <h5 className="font-semibold text-gray-700">เกี่ยวกับแอป</h5>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">เวอร์ชัน:</span>
              <span className="font-medium text-gray-800">1.0.0 (MVP)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ระบบ:</span>
              <span className="font-medium text-gray-800">ธนาคารต้นไม้</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">หน่วยงาน:</span>
              <span className="font-medium text-gray-800">ภาครัฐ</span>
            </div>
          </div>
        </div>

        {/* Features Info */}
        <div className="bg-blue-50 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <MapIcon size={18} className="text-blue-600" />
            <h5 className="font-semibold text-blue-900">ฟีเจอร์ปัจจุบัน</h5>
          </div>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ ปักหมุดต้นไม้ด้วย GPS</li>
            <li>✓ คำนวณคาร์บอนเครดิต</li>
            <li>✓ วิเคราะห์ด้วย AI</li>
            <li>✓ จัดการเอกสารแปลง</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={() => {
              if (confirm('คุณต้องการออกจากระบบหรือไม่?')) {
                onLogout();
                onClose();
              }
            }}
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
