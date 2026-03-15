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
