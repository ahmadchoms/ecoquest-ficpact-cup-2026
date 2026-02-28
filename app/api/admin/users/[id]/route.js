import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { adminUserSchema } from "@/lib/validations/admin";

export async function GET(request, { params }) {
  try {
    const id = params.id;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
        level: true,
        xp: true,
        profileImage: true,
        bio: true,
        createdAt: true,
        badges: { select: { id: true, name: true, rarity: true, icon: true } }
      }
    });

    if (!user) return NextResponse.json({ success: false, error: "User tidak ditemukan." }, { status: 404 });

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("[GET_ADMIN_USER_ID]", error);
    return NextResponse.json({ success: false, error: "Gagal memuat pengguna." }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const id = params.id;
    const body = await request.json();
    
    // Partial validation
    const parsedData = adminUserSchema.partial().safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json({ success: false, error: parsedData.error.errors }, { status: 400 });
    }

    const { password, ...updateData } = parsedData.data;
    // In production: if password is provided, hash it before saving
    // if (password) updateData.password = await hash(password);

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, username: true, email: true, role: true, status: true, level: true }
    });

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("[PATCH_ADMIN_USER_ID]", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ success: false, error: "Username atau Email sudah terdaftar." }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: "Gagal memperbarui pengguna." }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = params.id;
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch (error) {
    console.error("[DELETE_ADMIN_USER_ID]", error);
    return NextResponse.json({ success: false, error: "Gagal menghapus pengguna." }, { status: 500 });
  }
}
