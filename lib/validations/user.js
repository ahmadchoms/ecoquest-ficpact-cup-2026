import { z } from "zod";

/**
 * User Profile Update Schema
 * Used for validating user profile data in PATCH /api/user/profile
 */
export const userProfileSchema = z.object({
  name: z
    .string()
    .min(3, "Nama minimal 3 karakter")
    .max(100, "Nama maksimal 100 karakter")
    .optional(),
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .max(30, "Username maksimal 30 karakter")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username hanya boleh mengandung huruf, angka, underscore, dan dash")
    .optional(),
  bio: z
    .string()
    .max(500, "Bio maksimal 500 karakter")
    .nullable()
    .optional(),
  profileImage: z
    .string()
    .url("Profile image harus berupa URL yang valid")
    .nullable()
    .optional(),
});
