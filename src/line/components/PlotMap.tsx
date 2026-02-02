import React, { useEffect, useRef, useState } from 'react';
import { Tree, TreeStatus } from '../types';
import { X, AlertTriangle, CheckCircle2, Edit } from 'lucide-react';
import L from 'leaflet';

interface PlotMapProps {
  centerLat: number;
  centerLng: number;
  trees: Tree[];
  boundary?: { lat: number; lng: number }[];
  onAddTree: (lat: number, lng: number) => void;
  onUpdateTree: (tree: Tree) => void;
  onEditTree?: (treeId: string) => void;
  readOnly?: boolean;
}

const PlotMap: React.FC<PlotMapProps> = ({ 
  centerLat, 
  centerLng, 
  trees, 
  boundary,
  onAddTree, 
  onUpdateTree, 
  onEditTree,
  readOnly = false 
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const polygonRef = useRef<L.Polygon | null>(null);
  const [selectedTreeId, setSelectedTreeId] = useState<string | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView([centerLat, centerLng], 19); // High zoom for plot level

    L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
        maxZoom: 22,
        subdomains:['mt0','mt1','mt2','mt3']
    }).addTo(map);

    mapRef.current = map;

    // Accuracy Fix: Invalidate size after mount to ensure clicks align correctly
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    // Add Tree Handler
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (readOnly) return;
      // Visual feedback happens via the Modal opening, but we could add a temp marker here if needed
      onAddTree(e.latlng.lat, e.latlng.lng);
      setSelectedTreeId(null);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [centerLat, centerLng, readOnly, onAddTree]);

  // Render Boundary
  useEffect(() => {
    if (!mapRef.current) return;

    // Cleanup previous polygon
    if (polygonRef.current) {
      polygonRef.current.remove();
      polygonRef.current = null;
    }

    // Add new polygon if boundary exists
    if (boundary && boundary.length > 0) {
      const latLngs = boundary.map(p => [p.lat, p.lng] as [number, number]);
      
      polygonRef.current = L.polygon(latLngs, {
        color: '#f59e0b', // Amber-500 for property lines
        weight: 2,
        dashArray: '8, 8',
        fillColor: '#f59e0b',
        fillOpacity: 0.1,
        lineCap: 'square'
      }).addTo(mapRef.current);
    }
  }, [boundary]);

  // Sync Trees to Markers
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const currentIds = new Set(trees.map(t => t.id));

    // Remove old markers
    Object.keys(markersRef.current).forEach(id => {
      if (!currentIds.has(id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });

    // Add/Update markers
    trees.forEach((tree, index) => {
      const color = getStatusColorCode(tree.status);
      const isSelected = selectedTreeId === tree.id;
      
      // Use numeric index + 1 for display if ID is long, otherwise use ID
      const labelText = tree.id.length <= 3 ? tree.id : (index + 1).toString();

      const icon = L.divIcon({
        className: 'custom-tree-marker',
        html: `
          <div style="
            background-color: ${color};
            width: ${isSelected ? '32px' : '24px'};
            height: ${isSelected ? '32px' : '24px'};
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 700;
            font-family: sans-serif;
            font-size: ${isSelected ? '14px' : '10px'};
            transition: all 0.2s ease;
          ">
            ${labelText}
          </div>
        `,
        iconSize: [isSelected ? 32 : 24, isSelected ? 32 : 24],
        iconAnchor: [isSelected ? 16 : 12, isSelected ? 12 : 12],
        tooltipAnchor: [0, -12]
      });

      if (markersRef.current[tree.id]) {
        // Update existing
        const marker = markersRef.current[tree.id];
        marker.setLatLng([tree.lat, tree.lng]);
        marker.setIcon(icon);
        marker.setZIndexOffset(isSelected ? 1000 : 0);
      } else {
        // Create new
        const marker = L.marker([tree.lat, tree.lng], { icon }).addTo(map);

        marker.on('click', (e) => {
          L.DomEvent.stopPropagation(e); // Prevent map click
          setSelectedTreeId(tree.id);
        });

        markersRef.current[tree.id] = marker;
      }
    });
  }, [trees, selectedTreeId]);

  const getStatusColorCode = (status: TreeStatus) => {
    switch (status) {
      case TreeStatus.HEALTHY: return '#22c55e'; // green-500
      case TreeStatus.DAMAGED: return '#eab308'; // yellow-500
      case TreeStatus.DEAD: 
      case TreeStatus.MISSING: return '#ef4444'; // red-500
      default: return '#9ca3af';
    }
  };

  const handleStatusChange = (status: TreeStatus) => {
    const tree = trees.find(t => t.id === selectedTreeId);
    if (tree) {
      onUpdateTree({ ...tree, status });
    }
  };

  return (
    <div className="flex flex-col h-full relative group">
      {/* Map Container */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full rounded-xl overflow-hidden shadow-inner z-0"
      />

      {/* Helper Text */}
      {!readOnly && trees.length === 0 && (
        <div className="absolute top-4 left-0 right-0 text-center pointer-events-none z-[400]">
           <span className="bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md">
             แตะที่ว่างเพื่อระบุตำแหน่งต้นไม้
           </span>
        </div>
      )}

      {/* Editor Panel (Floating) */}
      {selectedTreeId && !readOnly && (
        <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-100 animate-slide-up z-[500] p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-800">จัดการต้นไม้ #{selectedTreeId}</h3>
            <button onClick={() => setSelectedTreeId(null)} className="p-1 hover:bg-gray-100 rounded-full">
              <X size={20} className="text-gray-500" />
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            <button 
              onClick={() => handleStatusChange(TreeStatus.HEALTHY)}
              className="flex flex-col items-center p-2 rounded-lg bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors"
            >
              <CheckCircle2 size={20} className="mb-1" />
              <span className="text-[10px] font-medium">สมบูรณ์</span>
            </button>
            <button 
              onClick={() => handleStatusChange(TreeStatus.DAMAGED)}
              className="flex flex-col items-center p-2 rounded-lg bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100 transition-colors"
            >
              <AlertTriangle size={20} className="mb-1" />
              <span className="text-[10px] font-medium">เสียหาย</span>
            </button>
            <button 
              onClick={() => handleStatusChange(TreeStatus.DEAD)}
              className="flex flex-col items-center p-2 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
            >
              <X size={20} className="mb-1" />
              <span className="text-[10px] font-medium">ตาย/หาย</span>
            </button>
            <button 
              onClick={() => onEditTree && selectedTreeId && onEditTree(selectedTreeId)}
              className="flex flex-col items-center p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              <Edit size={20} className="mb-1" />
              <span className="text-[10px] font-medium">แก้ไข</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlotMap;