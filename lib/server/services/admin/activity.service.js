import prisma from "@/lib/prisma";

const DEFAULT_ACTIVITY_LIMIT = 5;

/**
 * Activity Service — Querying recent user activities (mission completions).
 */
export async function getRecentActivities(limit = DEFAULT_ACTIVITY_LIMIT) {
  const recentCompletions = await prisma.missionCompletion.findMany({
    orderBy: { completedAt: "desc" },
    take: limit,
    include: {
      user: { select: { username: true, profileImage: true } },
      mission: { select: { title: true, icon: true, color: true, category: true } },
    },
  });

  return recentCompletions.map((c) => ({
    id: c.id,
    user_id: c.userId,
    username: c.user.username,
    action: `Menyelesaikan misi "${c.mission.title}"`,
    timestamp: c.completedAt.toISOString(),
    type: "mission_completion",
    xp_earned: c.xpEarned,
    mission_category: c.mission.category,
  }));
}
