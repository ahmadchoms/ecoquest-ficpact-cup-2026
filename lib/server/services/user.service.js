import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

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
