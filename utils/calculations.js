export const EMISSION_FACTORS = {
  carKm: 0.25,
  motorKm: 0.12,
  busKm: 0.05,
  acHour: 1.5,
  fridgeSmall: 0.5,
  fridgeMedium: 1.0,
  fridgeLarge: 1.8,
  lampPerHour: 0.04,
  beefPortion: 3.3,
  chickenPortion: 0.5,
};

export const WATER_FACTORS = {
  showerPerMin: 12,
  bucketBath: 25,
  toiletFlush: 6,
  dishwashingTap: 60,
  dishwashingBowl: 10,
  washingMachine: 80,
  cookingPortion: 2,
};

export const calculateCarbonFootprint = (inputs) => {
  const transport = (inputs.carKm || 0) * EMISSION_FACTORS.carKm +
    (inputs.motorKm || 0) * EMISSION_FACTORS.motorKm +
    (inputs.busKm || 0) * EMISSION_FACTORS.busKm;

  const household = (inputs.acHour || 0) * EMISSION_FACTORS.acHour +
    (EMISSION_FACTORS[`fridge${inputs.fridgeSize || 'Medium'}`] || EMISSION_FACTORS.fridgeMedium) +
    (inputs.lampCount || 0) * EMISSION_FACTORS.lampPerHour * 8;

  const food = (inputs.beefPortions || 0) * EMISSION_FACTORS.beefPortion +
    (inputs.chickenPortions || 0) * EMISSION_FACTORS.chickenPortion;

  const total = transport + household + food;
  const nationalAverage = 6.3;
  const treesNeeded = Math.ceil(total / 4);
  const comparison = ((total - nationalAverage) / nationalAverage * 100).toFixed(1);

  return {
    total: Math.round(total * 100) / 100,
    breakdown: {
      transport: Math.round(transport * 100) / 100,
      household: Math.round(household * 100) / 100,
      food: Math.round(food * 100) / 100,
    },
    nationalAverage,
    treesNeeded,
    comparison: parseFloat(comparison),
    rating: total <= 3 ? "excellent" : total <= 6 ? "good" : total <= 10 ? "average" : "high",
  };
};

export const calculateWaterUsage = (inputs) => {
  const bathing = inputs.useShower
    ? (inputs.bathMin || 0) * WATER_FACTORS.showerPerMin
    : WATER_FACTORS.bucketBath;

  const toilet = (inputs.flushCount || 0) * WATER_FACTORS.toiletFlush;

  const kitchen = inputs.useTapDish
    ? WATER_FACTORS.dishwashingTap
    : WATER_FACTORS.dishwashingBowl;

  const cooking = (inputs.cookingPortions || 0) * WATER_FACTORS.cookingPortion;
  const laundry = ((inputs.washMachine || 0) / 7) * WATER_FACTORS.washingMachine;
  const plants = inputs.plantWater || 0;

  const total = bathing + toilet + kitchen + cooking + laundry + plants;
  const nationalAverage = 150;
  const yearlyUsage = total * 365;
  const bottleEquivalent = Math.round(total / 0.6);

  return {
    total: Math.round(total * 10) / 10,
    breakdown: {
      bathing: Math.round(bathing * 10) / 10,
      toilet: Math.round(toilet * 10) / 10,
      kitchen: Math.round(kitchen * 10) / 10,
      cooking: Math.round(cooking * 10) / 10,
      laundry: Math.round(laundry * 10) / 10,
      plants: Math.round(plants * 10) / 10,
    },
    nationalAverage,
    yearlyUsage: Math.round(yearlyUsage),
    bottleEquivalent,
    savingPotential: Math.round(Math.max(0, total - nationalAverage * 0.7) * 365),
    rating: total <= 100 ? "excellent" : total <= 150 ? "good" : total <= 200 ? "average" : "high",
  };
};

/**
 * Calculate performance-based XP and Point rewards
 * @param {number} performancePercent - Performance score from 0-100 (0-1 or 0-100)
 * @param {number} baseXP - Base XP reward from mission
 * @param {number} basePoints - Base point reward from mission
 * @returns {object} { earnedXP, earnedPoints }
 */
export const calculatePerformanceReward = (
  performancePercent,
  baseXP,
  basePoints,
) => {
  // Normalize performance to 0-1 if it's 0-100
  const perfScore =
    performancePercent > 1 ? performancePercent / 100 : performancePercent;

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
export const calculateQuizReward = (
  correctCount,
  totalCount,
  baseXP,
  basePoints,
) => {
  const performancePercent = Math.round((correctCount / totalCount) * 100);
  const { earnedXP, earnedPoints } = calculatePerformanceReward(
    performancePercent,
    baseXP,
    basePoints,
  );

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
export const calculateProgressReward = (
  completedPercent,
  baseXP,
  basePoints,
) => {
  return calculatePerformanceReward(completedPercent, baseXP, basePoints);
};

/**
 * Calculate environmental impact from mission completion
 * @param {string} category - Mission category (CLIMATE, WATER, WASTE, etc)
 * @param {number} xpEarned - XP earned from mission
 * @returns {object} Impact metrics { carbonSaved, waterSaved, wasteClassified, speciesLearned, mangroveRestored }
 */
export const calculateImpactFromMission = (category, xpEarned) => {
  // Base impact value: 10% of XP earned
  const baseValue = Math.ceil(xpEarned * 0.1);

  const impact = {
    carbonSaved: 0,
    waterSaved: 0,
    wasteClassified: 0,
    speciesLearned: 0,
    mangroveRestored: 0,
  };

  // Map mission categories to environmental impact using emission/water factors
  const impactMap = {
    CLIMATE: () => ({
      ...impact,
      carbonSaved: Math.ceil(baseValue * EMISSION_FACTORS.carKm * 10),
    }),
    WATER: () => ({
      ...impact,
      waterSaved: Math.ceil(baseValue * WATER_FACTORS.showerPerMin * 5),
    }),
    WASTE: () => ({
      ...impact,
      wasteClassified: baseValue,
    }),
    BIODIVERSITY: () => ({
      ...impact,
      speciesLearned: baseValue,
    }),
    COASTAL: () => ({
      ...impact,
      mangroveRestored: baseValue,
    }),
    OCEAN: () => ({
      ...impact,
      waterSaved: Math.ceil(baseValue * WATER_FACTORS.showerPerMin * 8),
    }),
    TRANSPORT: () => ({
      ...impact,
      carbonSaved: Math.ceil(baseValue * EMISSION_FACTORS.carKm * 8),
      waterSaved: Math.ceil(baseValue * WATER_FACTORS.showerPerMin * 2),
    }),
  };

  // Return mapped impact or distribute evenly if category unknown
  if (impactMap[category]) {
    return impactMap[category]();
  }

  const split = Math.ceil(baseValue / 5);
  return {
    carbonSaved: split,
    waterSaved: split,
    wasteClassified: split,
    speciesLearned: split,
    mangroveRestored: split,
  };
};

/**
 * Aggregate impact metrics from all mission completions
 * @param {array} missionCompletions - Array of mission completion objects with mission.category and xpEarned
 * @returns {object} Total aggregated impact across all metrics
 */
export const aggregateImpact = (missionCompletions) => {
  const initialImpact = {
    carbonSaved: 0,
    waterSaved: 0,
    wasteClassified: 0,
    speciesLearned: 0,
    mangroveRestored: 0,
  };

  return missionCompletions.reduce((totalImpact, completion) => {
    const missionImpact = calculateImpactFromMission(
      completion.mission.category,
      completion.xpEarned
    );

    return {
      carbonSaved: totalImpact.carbonSaved + missionImpact.carbonSaved,
      waterSaved: totalImpact.waterSaved + missionImpact.waterSaved,
      wasteClassified: totalImpact.wasteClassified + missionImpact.wasteClassified,
      speciesLearned: totalImpact.speciesLearned + missionImpact.speciesLearned,
      mangroveRestored: totalImpact.mangroveRestored + missionImpact.mangroveRestored,
    };
  }, initialImpact);
};

/**
 * Convert impact metrics to tree equivalent
 * Using environmental conversion ratios
 * @param {object} impact - Impact metrics object
 * @returns {number} Number of trees equivalent
 */
export const calculateTreeEquivalent = (impact) => {
  // Tree equivalency conversions:
  // ~21kg CO2 per tree per year
  // ~1000L water per tree per year
  // ~2 species per tree ecosystem
  // ~2 mangroves = ~1 tree impact
  const conversions = {
    carbon: impact.carbonSaved / 21,
    water: impact.waterSaved / 1000,
    biodiversity: impact.speciesLearned / 2,
    mangrove: impact.mangroveRestored * 0.5,
  };

  // Return the highest equivalent value
  return Math.ceil(Math.max(...Object.values(conversions)));
};
