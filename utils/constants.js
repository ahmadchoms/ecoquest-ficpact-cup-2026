export const XP_PER_LEVEL = 500;

export const MAP_CENTER = [-2.5, 118];
export const MAP_ZOOM = 5;
export const MAP_MIN_ZOOM = 4;
export const MAP_MAX_ZOOM = 10;

export const TILE_URL = "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png";
export const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

export const PROGRESS_COLORS = {
  notStarted: '#ef4444',
  inProgress: '#fbbf24',
  completed: '#22c55e',
  perfect: '#f59e0b',
};

export const REGIONS = [
  "SUMATERA",
  "JAWA",
  "KALIMANTAN",
  "SULAWESI",
  "BALI_NUSA_TENGGARA",
  "MALUKU",
  "PAPUA",
];

export const RARITY_ORDER = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

export const IMPACT_LABELS = {
  carbonSaved: { icon: '🌡️', label: 'Karbon Tersimpan', unit: 'kg CO₂' },
  waterSaved: { icon: '💧', label: 'Air Dihemat', unit: 'liter' },
  wasteClassified: { icon: '♻️', label: 'Sampah Dipilah', unit: 'item' },
  speciesLearned: { icon: '🦏', label: 'Spesies Dipelajari', unit: 'spesies' },
  mangroveRestored: { icon: '🌿', label: 'Mangrove Ditanam', unit: 'pohon' },
};

export const CATEGORY_STYLES = {
  WASTE: { bg: "bg-orange", accent: "bg-orange/20" },
  WATER: { bg: "bg-mint", accent: "bg-mint/20" },
  BIODIVERSITY: { bg: "bg-purple", accent: "bg-purple/20" },
  OCEAN: { bg: "bg-blue-300", accent: "bg-blue-100" },
  TRANSPORT: { bg: "bg-green", accent: "bg-green/20" },
  CLIMATE: { bg: "bg-yellow", accent: "bg-yellow/20" },
  COASTAL: { bg: "bg-pink", accent: "bg-pink/20" },
};

export const getMissionStyle = (category) =>
  CATEGORY_STYLES[category] ?? { bg: "bg-white", accent: "bg-gray-100" };

