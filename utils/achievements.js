export const checkProvinceConqueror = (completedMissions, allProvinces) => {
  if (!allProvinces) return false;
  const provinceCompletions = {};

  completedMissions.forEach((key) => {
    const [, provinceId] = key.split(":");
    if (!provinceCompletions[provinceId]) {
      provinceCompletions[provinceId] = 0;
    }
    provinceCompletions[provinceId]++;
  });

  for (const province of allProvinces) {
    const totalMissions = province.missions?.length || 0;
    const completed = provinceCompletions[province.id] || 0;
    if (totalMissions > 0 && completed >= totalMissions) {
      return true;
    }
  }
  return false;
};

export const getRecommendedMission = (
  completedMissions,
  allProvinces,
  allMissions,
) => {
  if (!allProvinces || !allMissions) return null;
  const missionsMap = Array.isArray(allMissions)
    ? Object.fromEntries(allMissions.map((m) => [m.id, m]))
    : allMissions;

  for (const province of allProvinces) {
    for (const missionId of province.missions || []) {
      const key = `${missionId}:${province.id}`;
      if (!completedMissions.includes(key)) {
        return {
          mission: missionsMap[missionId],
          province,
        };
      }
    }
  }
  return null;
};

export const getMissionUnlockStatus = (
  provinceMissions,
  completedMissions,
  provinceId,
) => {
  return provinceMissions.map((missionId, index) => {
    const key = `${missionId}:${provinceId}`;
    const isDone = completedMissions.includes(key);

    if (isDone) return "completed";
    if (index === 0) return "unlocked";

    const prevKey = `${provinceMissions[index - 1]}:${provinceId}`;
    const prevDone = completedMissions.includes(prevKey);
    return prevDone ? "unlocked" : "locked";
  });
};
