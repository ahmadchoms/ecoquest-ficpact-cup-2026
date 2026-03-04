import prisma from "@/lib/prisma";

/**
 * Analytics Service — Data aggregation operations for the Analytics page.
 */

const getDateFilter = (range) => {
  const startDate = new Date();
  if (range === "7d") startDate.setDate(startDate.getDate() - 7);
  else if (range === "30d") startDate.setDate(startDate.getDate() - 30);
  else if (range === "365d") startDate.setDate(startDate.getDate() - 365);
  else return {};

  return { gte: startDate };
};

export async function getAnalyticsSummary(range) {
  const dateFilter = getDateFilter(range);

  const [activeMissions, totalCompletionsResult, xpEarnedResult] =
    await Promise.all([
      prisma.mission.count({ where: { status: "ACTIVE" } }),
      prisma.missionCompletion.count({
        where: range !== "all" ? { completedAt: dateFilter } : {},
      }),
      prisma.missionCompletion.aggregate({
        where: range !== "all" ? { completedAt: dateFilter } : {},
        _sum: { xpEarned: true },
      }),
    ]);

  const uniqueParticipants = await prisma.missionCompletion.groupBy({
    by: ["userId"],
    where: range !== "all" ? { completedAt: dateFilter } : {},
  });

  const totalUsers = uniqueParticipants.length;
  const totalCompletions = totalCompletionsResult || 0;
  const xpEarned = xpEarnedResult?._sum?.xpEarned || 0;

  const completionRate =
    activeMissions > 0 && totalUsers > 0
      ? Math.min(
          Math.round((totalCompletions / (activeMissions * totalUsers)) * 100),
          100,
        )
      : 0;

  return {
    totalUsers,
    totalCompletions,
    activeMissions,
    xpEarned,
    completionRate,
  };
}

export async function getParticipationTrend(range) {
  let days = 7;
  if (range === "30d") days = 30;
  else if (range === "365d") days = 365;
  else if (range === "all") days = 30;

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days + 1);

  const completions = await prisma.missionCompletion.findMany({
    where: { completedAt: { gte: startDate } },
    select: { completedAt: true, xpEarned: true },
    orderBy: { completedAt: "asc" },
  });

  const formatter = new Intl.DateTimeFormat("id-ID", {
    weekday: days <= 7 ? "short" : undefined,
    day: "numeric",
    month: days > 7 ? "short" : undefined,
  });

  const dataMap = {};

  for (let i = 0; i < days; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    let name = formatter.format(d);
    if (days <= 7) name = name.split(",")[0];

    dataMap[key] = { name, partisipasi: 0, emisiDitekan: 0 };
  }

  for (const comp of completions) {
    const d = new Date(comp.completedAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    if (dataMap[key]) {
      dataMap[key].partisipasi += 1;
      dataMap[key].emisiDitekan += comp.xpEarned;
    }
  }

  return Object.keys(dataMap)
    .sort()
    .map((key) => dataMap[key]);
}

export async function getRegionalVolume(range) {
  const dateFilter = getDateFilter(range);

  const completions = await prisma.missionCompletion.findMany({
    where: range !== "all" ? { completedAt: dateFilter } : {},
    select: {
      mission: { select: { province: { select: { region: true } } } },
    },
  });

  const regionCounts = {
    SUMATERA: 0,
    JAWA: 0,
    KALIMANTAN: 0,
    SULAWESI: 0,
    PAPUA: 0,
    BALI_NUSA_TENGGARA: 0,
  };

  for (const c of completions) {
    const region = c.mission?.province?.region;
    if (region && regionCounts[region] !== undefined) {
      regionCounts[region]++;
    }
  }

  const regionNames = {
    SUMATERA: "Sumatera",
    JAWA: "Jawa",
    KALIMANTAN: "Kalimantan",
    SULAWESI: "Sulawesi",
    PAPUA: "Papua",
    BALI_NUSA_TENGGARA: "Bali / Nusa Tenggara",
  };

  return Object.entries(regionCounts)
    .map(([key, value]) => ({ name: regionNames[key], value }))
    .sort((a, b) => b.value - a.value);
}
