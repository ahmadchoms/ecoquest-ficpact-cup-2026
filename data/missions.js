export const missions = {
  "carbon-calculator": {
    id: "carbon-calculator",
    title: "Jejak Karbon Harianmu",
    subtitle: "Hitung & kurangi emisi karbon sehari-hari",
    description: "Rata-rata orang Indonesia menghasilkan 2.3 ton CO2 per tahun. Mari kita hitung jejakmu dan temukan cara menguranginya!",
    type: "calculator",
    difficulty: "easy",
    xpReward: 100,
    pointReward: 50,
    timeEstimate: "5 menit",
    badgeReward: "carbon-conscious",
    category: "climate",
    component: "CarbonCalculator",
    icon: "🌡️",
    color: "from-orange-400 to-red-500",
  },
  "waste-sorting": {
    id: "waste-sorting",
    title: "Pilah Sampah Yuk!",
    subtitle: "Pelajari cara memilah sampah dengan benar",
    description: "Indonesia menghasilkan 67.8 juta ton sampah per tahun. Pelajari cara memilah sampah yang benar agar bisa didaur ulang.",
    type: "drag-drop",
    difficulty: "easy",
    xpReward: 120,
    pointReward: 60,
    timeEstimate: "5 menit",
    badgeReward: "waste-warrior",
    category: "waste",
    component: "WasteSorting",
    icon: "♻️",
    color: "from-green-400 to-teal-500",
  },
  "species-quiz": {
    id: "species-quiz",
    title: "Kenali Spesies Terancam",
    subtitle: "Quiz seputar satwa liar Indonesia",
    description: "Indonesia adalah mega-biodiversity country. Uji pengetahuanmu tentang spesies terancam punah yang butuh perlindungan kita.",
    type: "quiz",
    difficulty: "medium",
    xpReward: 150,
    pointReward: 75,
    timeEstimate: "7 menit",
    badgeReward: "species-guardian",
    category: "biodiversity",
    component: "SpeciesQuiz",
    icon: "🦏",
    color: "from-purple-400 to-indigo-500",
  },
  "mangrove-simulator": {
    id: "mangrove-simulator",
    title: "Pulihkan Mangrove",
    subtitle: "Simulasi reboisasi hutan mangrove",
    description: "Indonesia kehilangan 40% hutan mangrove dalam 30 tahun terakhir. Bantu pulihkan ekosistem pesisir yang vital ini!",
    type: "simulation",
    difficulty: "medium",
    xpReward: 180,
    pointReward: 90,
    timeEstimate: "8 menit",
    badgeReward: "mangrove-hero",
    category: "coastal",
    component: "MangroveSimulator",
    icon: "🌊",
    color: "from-blue-400 to-cyan-500",
  },
  "water-conservation": {
    id: "water-conservation",
    title: "Hemat Air Setiap Hari",
    subtitle: "Hitung & optimalkan konsumsi air harianmu",
    description: "Diperkirakan 27 juta orang Indonesia tidak memiliki akses air bersih. Seberapa efisien penggunaan airmu?",
    type: "calculator",
    difficulty: "easy",
    xpReward: 100,
    pointReward: 50,
    timeEstimate: "5 menit",
    badgeReward: "water-saver",
    category: "water",
    component: "WaterConservation",
    icon: "💧",
    color: "from-sky-400 to-blue-500",
  },
  "ocean-rescue": {
    id: "ocean-rescue",
    title: "Penyelamat Laut",
    subtitle: "Bersihkan sampah laut sebelum waktu habis",
    description: "Setiap tahun 8 juta ton sampah plastik masuk ke lautan. Bantu bersihkan laut dan selamatkan kehidupan laut!",
    type: "game",
    difficulty: "medium",
    xpReward: 150,
    pointReward: 75,
    timeEstimate: "2 menit",
    badgeReward: "ocean-guardian",
    category: "ocean",
    component: "OceanRescue",
    icon: "🌊",
    color: "from-blue-500 to-cyan-600",
  },
  "eco-route": {
    id: "eco-route",
    title: "EcoRoute - Smart Travel Simulator",
    subtitle: "Pilih kendaraan ramah lingkungan untuk perjalananmu",
    description: "Sektor transportasi menghasilkan 27% emisi gas rumah kaca di Indonesia. Simulasikan perjalanan dengan kendaraan terbaik dan buat pilihan transportasi yang lebih hijau!",
    type: "simulation",
    difficulty: "medium",
    xpReward: 160,
    pointReward: 80,
    timeEstimate: "3 menit",
    badgeReward: "eco-traveler",
    category: "transport",
    component: "EcoRoute",
    icon: "🚗",
    color: "from-green-400 to-emerald-600",
  },
};

export const getMissionById = (id) => missions[id];
export const missionList = Object.values(missions);

/**
 * Calculate performance-based XP and Point rewards
 * @param {number} performancePercent - Performance score from 0-100 (0-1 or 0-100)
 * @param {number} baseXP - Base XP reward from mission
 * @param {number} basePoints - Base point reward from mission
 * @returns {object} { earnedXP, earnedPoints }
 */
export const calculatePerformanceReward = (performancePercent, baseXP, basePoints) => {
  // Normalize performance to 0-1 if it's 0-100
  const perfScore = performancePercent > 1 ? performancePercent / 100 : performancePercent;
  
  // Performance tiers:
  // 0-40%: 30% of reward
  // 40-60%: 50% of reward
  // 60-80%: 75% of reward
  // 80-100%: 100% of reward
  let multiplier = 0.3; // Default untuk < 40%
  
  if (perfScore >= 0.8) {
    multiplier = 1.0; // 80-100% = full reward
  } else if (perfScore >= 0.6) {
    multiplier = 0.75; // 60-80% = 75% reward
  } else if (perfScore >= 0.4) {
    multiplier = 0.5; // 40-60% = 50% reward
  }
  
  return {
    earnedXP: Math.max(Math.round(baseXP * multiplier), 10), // Minimum 10 XP
    earnedPoints: Math.max(Math.round(basePoints * multiplier), 5), // Minimum 5 points
  };
};

/**
 * Calculate reward based on percentage correct (for quiz type missions)
 * @param {number} correctCount - Number of correct answers
 * @param {number} totalCount - Total questions/items
 * @param {number} baseXP - Base XP reward
 * @param {number} basePoints - Base point reward
 * @returns {object} { earnedXP, earnedPoints, performancePercent }
 */
export const calculateQuizReward = (correctCount, totalCount, baseXP, basePoints) => {
  const performancePercent = Math.round((correctCount / totalCount) * 100);
  const { earnedXP, earnedPoints } = calculatePerformanceReward(performancePercent, baseXP, basePoints);
  
  return {
    earnedXP,
    earnedPoints,
    performancePercent,
  };
};

/**
 * Calculate reward based on percentage completed (for simulation/game type missions)
 * @param {number} completedPercent - Percentage completed (0-100 or 0-1)
 * @param {number} baseXP - Base XP reward
 * @param {number} basePoints - Base point reward
 * @returns {object} { earnedXP, earnedPoints }
 */
export const calculateProgressReward = (completedPercent, baseXP, basePoints) => {
  return calculatePerformanceReward(completedPercent, baseXP, basePoints);
};
