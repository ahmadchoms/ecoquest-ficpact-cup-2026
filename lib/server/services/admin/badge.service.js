import prisma from "@/lib/prisma";

/**
 * Badge Service — CRUD operations for admin badge management.
 */

export async function listBadges({ page, limit, search, rarity, category }) {
  const skip = (page - 1) * limit;

  const where = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  if (rarity && rarity !== "ALL") where.rarity = rarity;
  if (category && category !== "ALL") where.category = category;

  const [badges, total] = await Promise.all([
    prisma.badge.findMany({
      where,
      skip,
      take: limit,
      orderBy: { name: "asc" },
      include: { _count: { select: { users: true } } },
    }),
    prisma.badge.count({ where }),
  ]);

  const data = badges.map((b) => {
    const { _count, ...rest } = b;
    return { ...rest, usersCount: _count.users };
  });

  return {
    data,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

export async function getBadgeById(id) {
  const badge = await prisma.badge.findUnique({
    where: { id },
    include: { _count: { select: { users: true } } },
  });

  if (!badge) return null;

  const { _count, ...rest } = badge;
  return { ...rest, usersCount: _count.users };
}

export async function createBadge(data) {
  return prisma.badge.create({ data });
}

export async function updateBadge(id, data) {
  return prisma.badge.update({ where: { id }, data });
}

export async function deleteBadge(id) {
  // Disconnect users from badge before deleting
  await prisma.badge.update({
    where: { id },
    data: { users: { set: [] } },
  });
  // Also disconnect from any mission rewards
  await prisma.mission.updateMany({
    where: { badgeRewardId: id },
    data: { badgeRewardId: null },
  });
  return prisma.badge.delete({ where: { id } });
}
