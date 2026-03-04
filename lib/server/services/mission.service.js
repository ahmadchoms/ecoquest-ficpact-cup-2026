import prisma from "@/lib/prisma";

/**
 * Mission Service — CRUD operations for admin mission management.
 */

export async function listMissions({ page, limit, search, status, difficulty, category }) {
  const skip = (page - 1) * limit;

  const where = {};
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  if (status && status !== "ALL") where.status = status;
  if (difficulty && difficulty !== "ALL") where.difficulty = difficulty;
  if (category && category !== "ALL") where.category = category;

  const [missions, total] = await Promise.all([
    prisma.mission.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        province: { select: { id: true, name: true } },
        badgeReward: { select: { id: true, name: true, icon: true } },
        _count: { select: { completions: true } },
      },
    }),
    prisma.mission.count({ where }),
  ]);

  const data = missions.map((m) => {
    const { _count, ...rest } = m;
    return { ...rest, completionsCount: _count.completions };
  });

  return {
    data,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

export async function getMissionById(id) {
  return prisma.mission.findUnique({
    where: { id },
    include: {
      province: { select: { id: true, name: true, region: true } },
      badgeReward: { select: { id: true, name: true, rarity: true, icon: true } },
    },
  });
}

export async function createMission(data) {
  return prisma.mission.create({ data });
}

export async function updateMission(id, data) {
  return prisma.mission.update({ where: { id }, data });
}

export async function deleteMission(id) {
  // Clean up related completions first to avoid foreign key constraint errors
  await prisma.missionCompletion.deleteMany({ where: { missionId: id } });
  return prisma.mission.delete({ where: { id } });
}
