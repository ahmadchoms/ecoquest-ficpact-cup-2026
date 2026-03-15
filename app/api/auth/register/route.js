import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validations/auth";
import { getUserByEmail, getUserByUsername, createUser } from "@/lib/server/services/admin/user.service";
import { generateUniqueUsername } from "@/lib/server/utils/username-generator";

export async function POST(req) {
  try {
    const body = await req.json();

    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Input tidak valid",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, password, phone } = validation.data;

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar. Silakan login." },
        { status: 409 }
      );
    }

    // Generate unique username dari nama
    const username = await generateUniqueUsername(name, getUserByUsername);

    const newUser = await createUser({
      name,
      username,
      email,
      password, // Pass plain text, createUser internally hashes it
      phone: phone || null,
      avatar: null,
      role: "USER",
    });

    return NextResponse.json(
      {
        message: "Registrasi berhasil",
        data: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REGISTER_ERROR]", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}