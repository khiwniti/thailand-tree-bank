import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, TreeDeciduous } from 'lucide-react';
import { Tree, TreeType, TreeStatus } from '../types';

interface TreeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (treeData: Partial<Tree>) => void;
  initialData?: Partial<Tree>;
  mode: 'add' | 'edit';
}

const TreeFormModal: React.FC<TreeFormModalProps> = ({ isOpen, onClose, onSave, initialData, mode }) => {
  const [formData, setFormData] = useState<Partial<Tree>>({
    type: TreeType.TEAK,
    status: TreeStatus.HEALTHY,
    plantedDate: new Date().toISOString().split('T')[0],
    lat: 0,
    lng: 0
  });

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        ...formData,
        ...initialData
      });
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  // Helper for Thai labels
  const getThaiTreeType = (type: TreeType) => {
    switch (type) {
      case TreeType.TEAK: return 'ไม้สัก';
      case TreeType.MAHOGANY: return 'ยางนา';
      case TreeType.RUBBER: return 'ยางพารา';
      default: return 'อื่นๆ';
    }
  };

  const getThaiTreeStatus = (status: TreeStatus) => {
    switch (status) {
      case TreeStatus.HEALTHY: return 'สมบูรณ์ (Healthy)';
      case TreeStatus.DAMAGED: return 'เสียหาย/โรคพืช (Damaged)';
      case TreeStatus.DEAD: return 'ยืนต้นตาย (Dead)';
      case TreeStatus.MISSING: return 'สูญหาย (Missing)';
      default: return status;
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in">
      <div className="bg-white w-full sm:w-11/12 max-w-md sm:rounded-2xl rounded-t-2xl p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
              <TreeDeciduous size={20} />
            </div>
            {mode === 'add' ? 'ลงทะเบียนต้นไม้ใหม่' : 'แก้ไขข้อมูลต้นไม้'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Location Readout */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-start gap-3">
            <MapPin className="text-emerald-500 mt-1 shrink-0" size={18} />
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">พิกัดภูมิศาสตร์ (GPS)</p>
              <p className="font-mono text-sm text-gray-800 break-all">
                {formData.lat?.toFixed(6)}, {formData.lng?.toFixed(6)}
              </p>
            </div>
          </div>

          {/* Tree Type */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">ชนิดพันธุ์ไม้</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(TreeType).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, type })}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                    formData.type === type
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {getThaiTreeType(type)}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">สถานะสุขภาพ</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as TreeStatus })}
              className="w-full p-3 rounded-xl border border-gray-200 bg-white text-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              {Object.values(TreeStatus).map((status) => (
                <option key={status} value={status}>{getThaiTreeStatus(status)}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">วันที่ปลูก</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="date"
                value={formData.plantedDate}
                onChange={(e) => setFormData({ ...formData, plantedDate: e.target.value })}
                className="w-full p-3 pl-10 rounded-xl border border-gray-200 bg-white text-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-[0.98] transition-all"
            >
              {mode === 'add' ? 'ยืนยันการปลูก' : 'บันทึกการแก้ไข'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TreeFormModal;