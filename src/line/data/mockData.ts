import { Plot, Tree, TreeType, TreeStatus, PlotDocument } from '../types';
import { raiToSqm } from '../utils/landUnits';

/**
 * Mock data generator for demo purposes
 * Generates realistic plots, trees, and documents for Thailand Tree Bank
 */

// Thai provinces for realistic location names
const PROVINCES = ['เชียงใหม่', 'เชียงราย', 'ลำพูน', 'ลำปาง', 'แม่ฮ่องสอน', 'น่าน', 'พะเยา', 'แพร่'];
const DISTRICTS = ['เมือง', 'สันทราย', 'หางดง', 'สะเมิง', 'ฝาง', 'แม่แจ่ม', 'จอมทอง'];
const PLOT_PREFIXES = ['แปลง', 'สวน', 'พื้นที่', 'โครงการ'];
const PLOT_SUFFIXES = ['เหนือ', 'ใต้', 'ตะวันออก', 'ตะวันตก', 'กลาง'];

// Tree types distribution (realistic for northern Thailand)
const TREE_TYPES = [
  { type: TreeType.TEAK, weight: 40 }, // สัก - most common
  { type: TreeType.RUBBER, weight: 30 }, // ยางพารา
  { type: TreeType.MAHOGANY, weight: 20 }, // ยางนา
  { type: TreeType.OTHER, weight: 10 }, // อื่นๆ
];

// Base coordinates for Chiang Mai region
const BASE_LAT = 18.7883;
const BASE_LNG = 98.9853;

/**
 * Generate random tree type based on weighted distribution
 */
function getRandomTreeType(): TreeType {
  const random = Math.random() * 100;
  let cumulative = 0;

  for (const { type, weight } of TREE_TYPES) {
    cumulative += weight;
    if (random <= cumulative) {
      return type;
    }
  }

  return TreeType.TEAK;
}

/**
 * Generate random tree status (90% healthy, 10% other)
 */
function getRandomTreeStatus(): TreeStatus {
  const random = Math.random();

  if (random < 0.90) return TreeStatus.HEALTHY;
  if (random < 0.95) return TreeStatus.DAMAGED;
  if (random < 0.98) return TreeStatus.DEAD;
  return TreeStatus.MISSING;
}

/**
 * Generate random date within the last 3 years
 */
function getRandomPlantedDate(): string {
  const now = new Date();
  const threeYearsAgo = new Date(now.getFullYear() - 3, 0, 1);
  const randomTime = threeYearsAgo.getTime() + Math.random() * (now.getTime() - threeYearsAgo.getTime());
  return new Date(randomTime).toISOString().split('T')[0];
}

/**
 * Generate boundary polygon around center point
 */
function generateBoundary(centerLat: number, centerLng: number, areaRai: number): { lat: number; lng: number }[] {
  // Calculate approximate radius based on area (simplified)
  const areaSqm = areaRai * 1600;
  const radius = Math.sqrt(areaSqm / Math.PI) / 111000; // Convert to degrees

  // Generate rectangular boundary
  return [
    { lat: centerLat + radius, lng: centerLng - radius },
    { lat: centerLat + radius, lng: centerLng + radius },
    { lat: centerLat - radius, lng: centerLng + radius },
    { lat: centerLat - radius, lng: centerLng - radius },
  ];
}

/**
 * Generate random trees within a boundary
 */
function generateTrees(
  plotId: string,
  centerLat: number,
  centerLng: number,
  count: number,
  areaRai: number
): Tree[] {
  const trees: Tree[] = [];
  const radius = Math.sqrt((areaRai * 1600) / Math.PI) / 111000;

  for (let i = 0; i < count; i++) {
    // Random position within circular area
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.sqrt(Math.random()) * radius * 0.8; // 80% of radius to keep inside boundary

    const tree: Tree = {
      id: `${plotId}-t${i + 1}`,
      lat: centerLat + distance * Math.cos(angle),
      lng: centerLng + distance * Math.sin(angle),
      type: getRandomTreeType(),
      status: getRandomTreeStatus(),
      plantedDate: getRandomPlantedDate(),
      dbhCm: 15 + Math.random() * 35, // 15-50 cm
      heightM: 5 + Math.random() * 15, // 5-20 m
    };

    trees.push(tree);
  }

  return trees;
}

/**
 * Generate mock documents for a plot
 */
function generateDocuments(plotId: string): PlotDocument[] {
  const docs: PlotDocument[] = [];

  // Land deed photo (always present)
  docs.push({
    id: `${plotId}-d1`,
    name: 'โฉนดที่ดิน_ฉบับจริง.jpg',
    size: `${(2 + Math.random() * 2).toFixed(1)} MB`,
    type: 'image',
    uploadDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: Math.random() > 0.1 ? 'verified' : 'processing',
    url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800',
  });

  // Sometimes add aerial photo
  if (Math.random() > 0.5) {
    docs.push({
      id: `${plotId}-d2`,
      name: 'ภาพถ่ายทางอากาศ.jpg',
      size: `${(3 + Math.random() * 3).toFixed(1)} MB`,
      type: 'image',
      uploadDate: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'verified',
      url: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=800',
    });
  }

  // Sometimes add KML file
  if (Math.random() > 0.7) {
    docs.push({
      id: `${plotId}-d3`,
      name: 'ขอบเขตที่ดิน.kml',
      size: `${(0.01 + Math.random() * 0.1).toFixed(2)} MB`,
      type: 'kml',
      uploadDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'verified',
    });
  }

  return docs;
}

/**
 * Generate a single mock plot
 */
export function generateMockPlot(
  index: number,
  centerLat: number = BASE_LAT,
  centerLng: number = BASE_LNG
): Plot {
  const plotId = `p${index + 1}`;
  const province = PROVINCES[index % PROVINCES.length];
  const district = DISTRICTS[index % DISTRICTS.length];
  const prefix = PLOT_PREFIXES[index % PLOT_PREFIXES.length];
  const suffix = PLOT_SUFFIXES[index % PLOT_SUFFIXES.length];

  // Random area between 3-15 rai
  const areaRai = 3 + Math.floor(Math.random() * 13);
  const areaNgan = Math.floor(Math.random() * 4);
  const areaWa = Math.floor(Math.random() * 100);
  const areaSqm = raiToSqm(areaRai, areaNgan, areaWa);

  // Random tree count (roughly 20-40 trees per rai)
  const treeCount = Math.floor(areaRai * (20 + Math.random() * 20));

  // Offset center for each plot
  const latOffset = (Math.random() - 0.5) * 0.2;
  const lngOffset = (Math.random() - 0.5) * 0.2;
  const plotCenterLat = centerLat + latOffset;
  const plotCenterLng = centerLng + lngOffset;

  const plot: Plot = {
    id: plotId,
    name: `${prefix} ${String.fromCharCode(65 + index)} - ${suffix} ${province}`,
    location: `${plotCenterLat.toFixed(4)}° N, ${plotCenterLng.toFixed(4)}° E`,
    centerLat: plotCenterLat,
    centerLng: plotCenterLng,
    areaRai,
    areaNgan,
    areaWa,
    areaSqm,
    boundary: generateBoundary(plotCenterLat, plotCenterLng, areaRai),
    trees: generateTrees(plotId, plotCenterLat, plotCenterLng, treeCount, areaRai),
    documents: generateDocuments(plotId),
    status: Math.random() > 0.1 ? 'active' : 'pending',
    createdAt: new Date(Date.now() - Math.random() * 730 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  };

  return plot;
}

/**
 * Generate multiple mock plots
 */
export function generateMockPlots(count: number = 3): Plot[] {
  const plots: Plot[] = [];

  for (let i = 0; i < count; i++) {
    plots.push(generateMockPlot(i));
  }

  return plots;
}

/**
 * Get statistics from mock plots
 */
export function getPlotStatistics(plots: Plot[]) {
  const totalTrees = plots.reduce((sum, plot) => sum + plot.trees.length, 0);
  const healthyTrees = plots.reduce(
    (sum, plot) => sum + plot.trees.filter(t => t.status === TreeStatus.HEALTHY).length,
    0
  );
  const totalAreaRai = plots.reduce((sum, plot) => sum + plot.areaRai, 0);
  const carbonKgPerYear = healthyTrees * 9.5;
  const estimatedValueThb = carbonKgPerYear * 300;

  return {
    totalPlots: plots.length,
    totalTrees,
    healthyTrees,
    damagedTrees: totalTrees - healthyTrees,
    healthPercentage: ((healthyTrees / totalTrees) * 100).toFixed(1),
    totalAreaRai,
    carbonKgPerYear,
    estimatedValueThb,
  };
}

/**
 * Generate demo scenario data
 */
export function generateDemoScenario(): {
  currentPlot: Plot;
  allPlots: Plot[];
  statistics: ReturnType<typeof getPlotStatistics>;
} {
  const allPlots = generateMockPlots(5);
  const currentPlot = allPlots[0];
  const statistics = getPlotStatistics(allPlots);

  return {
    currentPlot,
    allPlots,
    statistics,
  };
}
