import prisma from "@/lib/prisma";

/**
 * Province Service — CRUD operations for admin province management.
 */

export async function listProvinces({ page, limit, search, threatLevel }) {
  const skip = (page - 1) * limit;

  const where = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { region: { contains: search, mode: "insensitive" } },
    ];
  }
  if (threatLevel && threatLevel !== "ALL") where.threatLevel = threatLevel;

  const [provinces, total] = await Promise.all([
    prisma.province.findMany({
      where,
      skip,
      take: limit,
      orderBy: { name: "asc" },
      include: { _count: { select: { missions: true } } },
    }),
    prisma.province.count({ where }),
  ]);

  const data = provinces.map((p) => {
    const { _count, ...rest } = p;
    return { ...rest, missionsCount: _count.missions };
  });

  return {
    data,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

export async function getProvinceById(id) {
  return prisma.province.findUnique({
    where: { id },
    include: {
      missions: { select: { id: true, title: true, status: true, difficulty: true } },
    },
  });
}

export async function createProvince(data) {
  return prisma.province.create({ data });
}

export async function updateProvince(id, data) {
  return prisma.province.update({ where: { id }, data });
}

export async function deleteProvince(id) {
  // Disconnect missions before deleting to prevent cascade issues
  await prisma.mission.updateMany({
    where: { provinceId: id },
    data: { provinceId: null },
  });
  return prisma.province.delete({ where: { id } });
}
