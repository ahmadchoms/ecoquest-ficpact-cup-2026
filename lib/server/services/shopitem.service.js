import prisma from "@/lib/prisma";

/**
 * ShopItem Service — CRUD operations for admin shop items management.
 */

export async function listShopItems({ page = 1, limit = 10, search = "", type, isActive }) {
  const skip = (page - 1) * limit;

  const where = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  if (type && type !== "ALL") where.type = type;
  if (isActive !== undefined && isActive !== "ALL") {
    where.isActive = isActive === "true" || isActive === true;
  }

  const [items, total] = await Promise.all([
    prisma.shopItem.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        event: { select: { id: true, name: true, isActive: true } },
        _count: { select: { purchases: true } },
      },
    }),
    prisma.shopItem.count({ where }),
  ]);

  const data = items.map((i) => {
    const { _count, ...rest } = i;
    return { ...rest, purchasesCount: _count.purchases };
  });

  return {
    data,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

export async function getShopItemById(id) {
  return prisma.shopItem.findUnique({
    where: { id },
    include: {
      event: { select: { id: true, name: true } },
    },
  });
}

export async function createShopItem(data) {
  return prisma.shopItem.create({ data });
}

export async function updateShopItem(id, data) {
  return prisma.shopItem.update({ where: { id }, data });
}

export async function deleteShopItem(id) {
  // Clean up user purchases first to avoid constraints
  await prisma.userItem.deleteMany({ where: { itemId: id } });
  return prisma.shopItem.delete({ where: { id } });
}

/**
 * Finds all events whose endDate has passed but are still marked active,
 * then deactivates both the events and all their associated shop items
 * in a single atomic transaction.
 *
 * @returns {{ deactivatedEvents: number, deactivatedItems: number }}
 */
export async function deactivateExpiredEventItems() {
  const now = new Date();

  // Find all expired events that are still marked as active
  const expiredEvents = await prisma.event.findMany({
    where: {
      endDate: { lt: now },
      isActive: true,
    },
    select: { id: true },
  });

  if (expiredEvents.length === 0) {
    return { deactivatedEvents: 0, deactivatedItems: 0 };
  }

  const expiredEventIds = expiredEvents.map((e) => e.id);

  // Atomically deactivate events + their items
  const [updatedEvents, updatedItems] = await prisma.$transaction([
    prisma.event.updateMany({
      where: { id: { in: expiredEventIds } },
      data: { isActive: false },
    }),
    prisma.shopItem.updateMany({
      where: {
        eventId: { in: expiredEventIds },
        isActive: true,
      },
      data: { isActive: false },
    }),
  ]);

  return {
    deactivatedEvents: updatedEvents.count,
    deactivatedItems: updatedItems.count,
  };
}

