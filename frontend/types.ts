export enum TreeStatus {
  HEALTHY = 'Healthy',
  DAMAGED = 'Damaged',
  DEAD = 'Dead',
  MISSING = 'Missing'
}

export enum TreeType {
  TEAK = 'Teak',
  MAHOGANY = 'Mahogany',
  RUBBER = 'Rubber',
  OTHER = 'Other'
}

export interface Tree {
  id: string;
  lat: number;
  lng: number;
  type: TreeType;
  status: TreeStatus;
  plantedDate: string;
  dbhCm?: number; // Diameter at Breast Height
  heightM?: number; // Height in meters
  photoUrl?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PlotDocument {
  id: string;
  name: string;
  size: string;
  type: 'kml' | 'kmz' | 'image' | 'pdf';
  uploadDate: string;
  status: 'processing' | 'verified' | 'error';
  url?: string; // For image preview
}

export interface Plot {
  id: string;
  name: string;
  location: string;
  centerLat: number;
  centerLng: number;
  areaRai: number;
  areaNgan?: number;
  areaWa?: number;
  areaSqm: number; // Calculated from ไร่-งาน-วา
  trees: Tree[];
  documents: PlotDocument[];
  boundary?: { lat: number; lng: number }[];
  groupId?: string;
  ownerId?: string;
  status?: 'active' | 'pending' | 'verified' | 'suspended';
  createdAt?: string;
  updatedAt?: string;
}

export const CARBON_CREDIT_FACTOR = 9.5; // kg per tree per year