import prisma from "@/lib/prisma";

/**
 * Event Service — CRUD operations for admin event management.
 */

export async function listEvents({ page = 1, limit = 10, search = "", isActive }) {
  const skip = (page - 1) * limit;

  const where = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  
  // isActive can be string "true"/"false" if passed from query params, or boolean
  if (isActive !== undefined && isActive !== "ALL") {
    where.isActive = isActive === "true" || isActive === true;
  }

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { items: true } },
      },
    }),
    prisma.event.count({ where }),
  ]);

  const data = events.map((e) => {
    const { _count, ...rest } = e;
    return { ...rest, itemsCount: _count.items };
  });

  return {
    data,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

export async function getEventById(id) {
  return prisma.event.findUnique({
    where: { id },
    include: {
      items: {
        select: { id: true, name: true, type: true, price: true, isActive: true },
      },
    },
  });
}

export async function createEvent(data) {
  return prisma.event.create({ data });
}

export async function updateEvent(id, data) {
  return prisma.event.update({ where: { id }, data });
}

export async function deleteEvent(id) {
  return prisma.event.delete({ where: { id } });
}
