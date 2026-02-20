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
  "Sumatera", "Jawa", "Kalimantan", "Sulawesi",
  "Bali & Nusa Tenggara", "Maluku", "Papua",
];

export const RARITY_ORDER = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

export const IMPACT_LABELS = {
  carbonSaved: { icon: '🌡️', label: 'Karbon Tersimpan', unit: 'kg CO₂' },
  waterSaved: { icon: '💧', label: 'Air Dihemat', unit: 'liter' },
  wasteClassified: { icon: '♻️', label: 'Sampah Dipilah', unit: 'item' },
  speciesLearned: { icon: '🦏', label: 'Spesies Dipelajari', unit: 'spesies' },
  mangroveRestored: { icon: '🌿', label: 'Mangrove Ditanam', unit: 'pohon' },
};
