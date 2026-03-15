import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {
  calculateImpactFromMission,
  aggregateImpact,
  calculateTreeEquivalent,
} from "@/utils/calculations";

const BCRYPT_SALT_ROUNDS = 10;

/** Shared select fields for user list responses (excludes password) */
const USER_LIST_SELECT = {
  id: true,
  name: true,
  username: true,
  name: true,
  email: true,
  role: true,
  status: true,
  level: true,
  xp: true,
  profileImage: true,
  createdAt: true,
};

const DASHBOARD_USER_SELECT = {
  id: true,
  name: true,
  email: true,
  username: true,
  xp: true,
  points: true,
  level: true,
  profileImage: true,
  bio: true,
  role: true,
  status: true,
  createdAt: true,
  badges: {
    select: {
      id: true,
      name: true,
      icon: true,
      rarity: true,
      description: true,
    },
  },
  missionCompletions: {
    orderBy: { completedAt: "desc" },
    select: {
      id: true,
      xpEarned: true,
      completedAt: true,
      mission: {
        select: {
          id: true,
          title: true,
          category: true,
          provinceId: true,
          icon: true,
        },
      },
    },
  },
};

const USER_ITEMS_SELECT = {
      id: true,
      activeBannerId: true,
      activeBorderId: true,
      userItems: {
        select: {
          id: true,
          item: {
            select: {
              id: true,
              name: true,
              description: true,
              type: true,
              content: true,
              previewUrl: true,
              rarity: true,
            },
          },
          acquiredAt: true,
        },
      },
    };

/** Detailed select for single user GET (includes badges) */
const USER_DETAIL_SELECT = {
  ...USER_LIST_SELECT,
  bio: true,
  badges: { select: { id: true, name: true, rarity: true, icon: true } },
};

/**
 * User Service — CRUD operations for admin user management.
 */

export async function listUsers({ page, limit, search, role, status }) {
  const skip = (page - 1) * limit;

  const where = {};
  if (search) {
    where.OR = [
      { username: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }
  if (role && role !== "ALL") where.role = role;
  if (status && status !== "ALL") where.status = status;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: USER_LIST_SELECT,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    data: users,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

export async function getUserById(id) {
  return prisma.user.findUnique({
    where: { id },
    select: USER_DETAIL_SELECT,
  });
}

export async function getUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
    select: USER_DETAIL_SELECT,
  });
}

export async function getUserByUsername(username) {
  return prisma.user.findUnique({
    where: { username },
    select: USER_DETAIL_SELECT,
  });
}

export async function createUser(data) {
  const password = data.password || "user_ecoquest2026";
  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

  return prisma.user.create({
    data: {
      name: data.name,
      username: data.username,
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
      status: data.status,
      level: data.level,
      xp: data.xp,
    },
    select: USER_LIST_SELECT,
  });
}

export async function updateUser(id, data) {
  const { password, ...updateData } = data;

  if (password) {
    updateData.password = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  }

  return prisma.user.update({
    where: { id },
    data: updateData,
    select: USER_LIST_SELECT,
  });
}

export async function deleteUser(id) {
  return prisma.user.delete({ where: { id } });
}

/**
 * Format mission completion history for activity feed
 */
function formatActivityHistory(missionCompletions, limit = 10) {
  return missionCompletions.slice(0, limit).map((completion) => ({
    id: completion.id,
    date: completion.completedAt,
    action: `Menyelesaikan misi: ${completion.mission.title}`,
    xp: `+${completion.xpEarned}`,
    icon: completion.mission.icon,
  }));
}

/**
 * Get dashboard data untuk user (untuk frontend dashboard)
 */
export async function getUserDashboardData(email) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: DASHBOARD_USER_SELECT,
  });

  if (!user) {
    return null;
  }

  // Calculate impact metrics from mission completions
  const impactData = aggregateImpact(user.missionCompletions);

  // Get unique provinces from mission completions
  const provinceIds = [
    ...new Set(user.missionCompletions.map((mc) => mc.mission.provinceId)),
  ];

  // Calculate tree equivalent from impact
  const treesEquivalent = calculateTreeEquivalent(impactData);

  // Format activity history
  const activityHistory = formatActivityHistory(user.missionCompletions);

  // Calculate XP progress for next level
  const XP_PER_LEVEL = 500;
  const xpInCurrentLevel = user.xp % XP_PER_LEVEL;
  const xpToNextLevel = XP_PER_LEVEL;

  // Hapus missionCompletions dari response (sudah diproses)
  const { missionCompletions, ...userData } = user;

  return {
    ...userData,
    // Impact metrics calculated from missions
    impactData,
    treesEquivalent,
    // Progression data
    xpProgress: {
      current: xpInCurrentLevel,
      total: xpToNextLevel,
      percentage: Math.round((xpInCurrentLevel / xpToNextLevel) * 100),
    },
    // Mission & Province data
    exploredProvinces: provinceIds,
    completedMissions: user.missionCompletions.length,
    provincesCount: provinceIds.length,
    // Activity history for recent activity feed
    activityHistory,
  };
}

/**
 * Get all badges with user earned status
 */
export async function getUserBadges(email) {
  // Get user's earned badges
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      badges: {
        select: { id: true },
      },
    },
  });

  if (!user) {
    return null;
  }

  // Get all badges from database
  const allBadges = await prisma.badge.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      icon: true,
      rarity: true,
      category: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const earnedBadgeIds = new Set(user.badges.map((b) => b.id));

  // Map badges with earned status
  const badgesWithStatus = allBadges.map((badge) => ({
    ...badge,
    earned: earnedBadgeIds.has(badge.id),
  }));

  return badgesWithStatus;
}

/**
 * Get user items grouped by type (BANNER, BORDER)
 * Including current active selections
 */
export async function getUserItems(email) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: USER_ITEMS_SELECT,
  });

  if (!user) {
    return null;
  }

  // Group items by type
  const banners = user.userItems
    .filter((ui) => ui.item.type === "BANNER")
    .map((ui) => ({
      ...ui.item,
      acquiredAt: ui.acquiredAt,
      isActive: ui.item.id === user.activeBannerId,
    }));

  const borders = user.userItems
    .filter((ui) => ui.item.type === "BORDER")
    .map((ui) => ({
      ...ui.item,
      acquiredAt: ui.acquiredAt,
      isActive: ui.item.id === user.activeBorderId,
    }));

  return {
    banners,
    borders,
    activeSelection: {
      bannerId: user.activeBannerId,
      borderId: user.activeBorderId,
    },
  };
}

/**
 * Update user's active banner and border selections
 */
export async function updateUserItemSelection(
  email,
  activeBannerId,
  activeBorderId
) {
  // Verify user owns the items if they're trying to set them
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!user) return null;

  // If banner specified, verify user has it
  if (activeBannerId) {
    const ownsBanner = await prisma.userItem.findFirst({
      where: {
        userId: user.id,
        itemId: activeBannerId,
      },
    });
    if (!ownsBanner) throw new Error("User does not own this banner");
  }

  // If border specified, verify user has it
  if (activeBorderId) {
    const ownsBorder = await prisma.userItem.findFirst({
      where: {
        userId: user.id,
        itemId: activeBorderId,
      },
    });
    if (!ownsBorder) throw new Error("User does not own this border");
  }

  // Update user's active selections
  return prisma.user.update({
    where: { id: user.id },
    data: {
      activeBannerId: activeBannerId || null,
      activeBorderId: activeBorderId || null,
    },
    select: {
      id: true,
      activeBannerId: true,
      activeBorderId: true,
    },
  });
}
