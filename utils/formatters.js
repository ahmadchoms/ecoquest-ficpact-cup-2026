export const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toFixed ? num.toFixed(1) : String(num);
};

export const formatXP = (xp) => {
  return xp.toLocaleString('id-ID');
};

export const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const threatLevelLabel = (level) => {
  const map = {
    low: { text: 'Rendah', color: 'text-green-600', bg: 'bg-green-100' },
    medium: { text: 'Sedang', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    high: { text: 'Tinggi', color: 'text-orange-600', bg: 'bg-orange-100' },
    critical: { text: 'Kritis', color: 'text-red-600', bg: 'bg-red-100' },
  };
  return map[level] || map.medium;
};

export const difficultyLabel = (diff) => {
  const map = {
    easy: { text: 'Mudah', color: 'text-green-600', bg: 'bg-green-100' },
    medium: { text: 'Sedang', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    hard: { text: 'Sulit', color: 'text-red-600', bg: 'bg-red-100' },
  };
  return map[diff] || map.easy;
};

export const rarityColor = (rarity) => {
  const map = {
    common: '#9ca3af',
    uncommon: '#22c55e',
    rare: '#3b82f6',
    epic: '#a855f7',
    legendary: '#f59e0b',
  };
  return map[rarity] || map.common;
};

export function formatCompactNumber(num, decimals = 1) {
  if (num === null || num === undefined) return "0";
  
  const absNum = Math.abs(num);
  const sign = num < 0 ? "-" : "";

  // Triliun
  if (absNum >= 1e12) {
    return sign + (absNum / 1e12).toFixed(decimals).replace(/\.0+$/, "") + "t";
  }
  // Miliar
  if (absNum >= 1e9) {
    return sign + (absNum / 1e9).toFixed(decimals).replace(/\.0+$/, "") + "m";
  }
  // Juta
  if (absNum >= 1e6) {
    return sign + (absNum / 1e6).toFixed(decimals).replace(/\.0+$/, "") + "jt";
  }
  // Ribu
  if (absNum >= 1e3) {
    return sign + (absNum / 1e3).toFixed(decimals).replace(/\.0+$/, "") + "k";
  }
  
  return sign + absNum.toString();
}