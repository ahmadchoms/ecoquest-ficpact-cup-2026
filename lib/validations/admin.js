import { z } from "zod";
import {
  Role,
  UserStatus,
  MissionType,
  Difficulty,
  MissionStatus,
  MissionCategory,
  Rarity,
} from "@prisma/client";

// --- Enums ---
const roleEnum = z.nativeEnum(Role, {
  errorMap: () => ({ message: "Invalid role" }),
});
const userStatusEnum = z.nativeEnum(UserStatus, {
  errorMap: () => ({ message: "Invalid user status" }),
});
const missionTypeEnum = z.nativeEnum(MissionType, {
  errorMap: () => ({ message: "Invalid mission type" }),
});
const difficultyEnum = z.nativeEnum(Difficulty, {
  errorMap: () => ({ message: "Invalid difficulty" }),
});
const missionStatusEnum = z.nativeEnum(MissionStatus, {
  errorMap: () => ({ message: "Invalid mission status" }),
});
const missionCategoryEnum = z.nativeEnum(MissionCategory, {
  errorMap: () => ({ message: "Invalid mission category" }),
});
const rarityEnum = z.nativeEnum(Rarity, {
  errorMap: () => ({ message: "Invalid rarity" }),
});

// --- Admin Validators ---
export const adminUserSchema = z.object({
  username: z.string().min(3).max(50),
  name: z.string().min(3).max(50),
  email: z.string().email(),
  role: roleEnum.default("USER"),
  status: userStatusEnum.default("ACTIVE"),
  level: z.number().int().min(1).default(1),
  xp: z.number().int().min(0).default(0),
  points: z.number().int().min(0).default(0),
});

export const adminProvinceSchema = z.object({
  name: z.string().min(2),
  region: z.string().min(2),
  threatLevel: difficultyEnum.optional(),
  ecosystems: z.union([z.string(), z.array(z.string())]).transform((val) =>
    Array.isArray(val)
      ? val
      : val
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean),
  ),
  species: z.union([z.string(), z.array(z.string())]).transform((val) =>
    Array.isArray(val)
      ? val
      : val
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean),
  ),
  description: z.string().optional(),
  funFact: z.string().optional(),
});

export const adminMissionSchema = z.object({
  title: z.string().min(3),
  subtitle: z.string().optional(),
  description: z.string().min(10),
  type: missionTypeEnum,
  difficulty: difficultyEnum,
  status: missionStatusEnum.default("ACTIVE"),
  xpReward: z.number().int().min(0),
  pointsReward: z.number().int().min(0),
  timeEstimate: z.string().optional(),
  category: missionCategoryEnum,
  provinceId: z.string().cuid(),
  badgeRewardId: z.string().cuid().optional().nullable(),
  icon: z.string().optional(),
});

export const adminBadgeSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  rarity: rarityEnum,
  category: missionCategoryEnum.optional(),
  icon: z.string().optional(),
});

// API Query Params Validations
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
});
