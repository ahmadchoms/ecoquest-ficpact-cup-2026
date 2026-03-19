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
