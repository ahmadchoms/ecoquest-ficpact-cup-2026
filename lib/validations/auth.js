import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.email("Format email tidak valid"),
  phone: z
    .string()
    .min(10, "Nomor HP minimal 10 digit")
    .optional()
    .or(z.literal("")),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const forgotPasswordSchema = z.object({ email: z.string().email() });

export const resetPasswordSchema = z.object({ password: z.string().min(6) });

export const changePasswordSchema = z.object({ password: z.string().min(6) });