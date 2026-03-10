import { create } from "zustand";
import { persist } from "zustand/middleware";

const XP_PER_LEVEL = 500;

export const useUserStore = create(
  persist(
    (set, get) => ({
      explorerName: "",
      totalXP: 0,
      level: 1,
      coins: 0,
      earnedBadges: [],
      completedMissions: [],
      exploredProvinces: [],
      missionScores: {},
      impactData: {
        carbonSaved: 0,
        waterSaved: 0,
        wasteClassified: 0,
        speciesLearned: 0,
        mangroveRestored: 0,
      },
      firstVisit: true,
      lastActive: null,

      setExplorerName: (name) => set({ explorerName: name }),

      completeOnboarding: () => set({ firstVisit: false }),

      addXP: (xp) => {
        const prev = get();
        const newXP = prev.totalXP + xp;
        const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
        const leveledUp = newLevel > prev.level;
        set({ totalXP: newXP, level: newLevel, lastActive: new Date().toISOString() });
        return { leveledUp, newLevel };
      },

      addCoins: (amount) => {
        const prev = get();
        const newCoins = prev.coins + amount;
        set({ coins: newCoins, lastActive: new Date().toISOString() });
        return newCoins;
      },

      deductCoins: (amount) => {
        const prev = get();
        const newCoins = Math.max(0, prev.coins - amount);
        set({ coins: newCoins, lastActive: new Date().toISOString() });
        return newCoins;
      },

      completeMission: (missionId, provinceId, xpEarned, pointsEarned = 0, impactValues = {}) => {
        const key = `${missionId}:${provinceId}`;
        const prev = get();
        if (prev.completedMissions.includes(key)) return;

        const newCompleted = [...prev.completedMissions, key];
        const newExplored = prev.exploredProvinces.includes(provinceId)
          ? prev.exploredProvinces
          : [...prev.exploredProvinces, provinceId];
        const newImpact = {
          carbonSaved: prev.impactData.carbonSaved + (impactValues.carbonSaved || 0),
          waterSaved: prev.impactData.waterSaved + (impactValues.waterSaved || 0),
          wasteClassified: prev.impactData.wasteClassified + (impactValues.wasteClassified || 0),
          speciesLearned: prev.impactData.speciesLearned + (impactValues.speciesLearned || 0),
          mangroveRestored: prev.impactData.mangroveRestored + (impactValues.mangroveRestored || 0),
        };

        set({
          completedMissions: newCompleted,
          exploredProvinces: newExplored,
          impactData: newImpact,
          missionScores: { ...prev.missionScores, [key]: xpEarned },
        });

        get().addXP(xpEarned);
        get().addCoins(pointsEarned);
        get().checkAchievements(newCompleted, newExplored);
      },

      isMissionDone: (missionId, provinceId) => {
        return get().completedMissions.includes(`${missionId}:${provinceId}`);
      },

      getProvinceProgress: (provinceId, totalMissions) => {
        const done = get().completedMissions.filter((m) =>
          m.endsWith(`:${provinceId}`)
        ).length;
        return totalMissions > 0 ? Math.round((done / totalMissions) * 100) : 0;
      },

      getProvinceMissionsDone: (provinceId) => {
        return get().completedMissions.filter((m) =>
          m.endsWith(`:${provinceId}`)
        ).length;
      },

      unlockBadge: (badgeId) => {
        const prev = get();
        if (!prev.earnedBadges.includes(badgeId)) {
          set({ earnedBadges: [...prev.earnedBadges, badgeId] });
          return true;
        }
        return false;
      },

      checkAchievements: (completedMissions, exploredProvinces) => {
        const self = get();
        if (exploredProvinces.length >= 5) self.unlockBadge("eco-explorer");
        if (exploredProvinces.length >= 10) self.unlockBadge("indonesian-hero");
        if (completedMissions.length >= 10) self.unlockBadge("eco-warrior");
      },

      getXPProgress: () => {
        const { totalXP } = get();
        const xpInCurrentLevel = totalXP % XP_PER_LEVEL;
        const percentage = (xpInCurrentLevel / XP_PER_LEVEL) * 100;
        return { xpInCurrentLevel, xpToNextLevel: XP_PER_LEVEL, percentage };
      },

      getTotalImpactSummary: () => {
        const { impactData, completedMissions, exploredProvinces } = get();
        return {
          ...impactData,
          missionsCompleted: completedMissions.length,
          provincesExplored: exploredProvinces.length,
          treesEquivalent: Math.floor(impactData.carbonSaved / 4),
        };
      },

      resetProgress: () => {
        set({
          totalXP: 0, level: 1, earnedBadges: [],
          completedMissions: [], exploredProvinces: [],
          missionScores: {},
          impactData: {
            carbonSaved: 0, waterSaved: 0, wasteClassified: 0,
            speciesLearned: 0, mangroveRestored: 0,
          },
          firstVisit: true, lastActive: null,
        });
      },
    }),
    {
      name: "ecoquest-v1",
    }
  )
);
