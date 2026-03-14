import prisma from "@/lib/prisma";

/**
 * Stats Service — Dashboard KPI aggregation queries.
 */
export async function getDashboardStats() {
  const [totalUsers, activeMissions, activeProvinces, totalCompletions, pendingMissionsCount] =
    await Promise.all([
      prisma.user.count({ where: { role: "USER" } }),
      prisma.mission.count({ where: { status: "ACTIVE" } }),
      prisma.province.count({
        where: { missions: { some: { status: "ACTIVE" } } },
      }),
      prisma.missionCompletion.count(),
      prisma.mission.count({ where: { status: "DRAFT" } }),
    ]);

  // Completion rate
  const completionRate =
    activeMissions > 0 && totalUsers > 0
      ? Math.min(Math.round((totalCompletions / (activeMissions * totalUsers)) * 100), 100)
      : 0;

  // XP awarded today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const xpTodayResult = await prisma.missionCompletion.aggregate({
    where: { completedAt: { gte: today } },
    _sum: { xpEarned: true },
  });
  const xpToday = xpTodayResult._sum.xpEarned || 0;

  return {
    totalUsers,
    activeMissions,
    activeProvinces,
    totalCompletions,
    completionRate,
    xpToday,
    pendingMissionsCount,
  };
}
