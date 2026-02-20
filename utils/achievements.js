import { provinces } from '../data/provinces';
import { missions } from '../data/missions';

export const checkProvinceConqueror = (completedMissions) => {
  const provinceCompletions = {};

  completedMissions.forEach(key => {
    const [, provinceId] = key.split(':');
    if (!provinceCompletions[provinceId]) {
      provinceCompletions[provinceId] = 0;
    }
    provinceCompletions[provinceId]++;
  });

  for (const province of provinces) {
    const totalMissions = province.missions.length;
    const completed = provinceCompletions[province.id] || 0;
    if (completed >= totalMissions) {
      return true;
    }
  }
  return false;
};

export const getRecommendedMission = (completedMissions, exploredProvinces) => {
  for (const province of provinces) {
    for (const missionId of province.missions) {
      const key = `${missionId}:${province.id}`;
      if (!completedMissions.includes(key)) {
        return {
          mission: missions[missionId],
          province,
        };
      }
    }
  }
  return null;
};

export const getMissionUnlockStatus = (provinceMissions, completedMissions, provinceId) => {
  return provinceMissions.map((missionId, index) => {
    const key = `${missionId}:${provinceId}`;
    const isDone = completedMissions.includes(key);

    if (isDone) return 'completed';
    if (index === 0) return 'unlocked';

    const prevKey = `${provinceMissions[index - 1]}:${provinceId}`;
    const prevDone = completedMissions.includes(prevKey);
    return prevDone ? 'unlocked' : 'locked';
  });
};
