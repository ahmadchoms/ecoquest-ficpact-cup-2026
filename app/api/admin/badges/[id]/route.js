import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { adminBadgeSchema } from "@/lib/validations/admin";

export async function GET(request, { params }) {
  try {
    const id = params.id;
    const badge = await prisma.badge.findUnique({
      where: { id },
      include: {
        _count: { select: { users: true } }
      }
    });

    if (!badge) return NextResponse.json({ success: false, error: "Lencana tidak ditemukan." }, { status: 404 });

    // Transform count
    const formattedBadge = {
      ...badge,
      usersCount: badge._count.users
    };
    delete formattedBadge._count;

    return NextResponse.json({ success: true, data: formattedBadge });
  } catch (error) {
    console.error("[GET_ADMIN_BADGE_ID]", error);
    return NextResponse.json({ success: false, error: "Gagal memuat lencana." }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const id = params.id;
    const body = await request.json();
    
    const parsedData = adminBadgeSchema.partial().safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json({ success: false, error: parsedData.error.errors }, { status: 400 });
    }

    const updatedBadge = await prisma.badge.update({
      where: { id },
      data: parsedData.data
    });

    return NextResponse.json({ success: true, data: updatedBadge });
  } catch (error) {
    console.error("[PATCH_ADMIN_BADGE_ID]", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ success: false, error: "Nama lencana sudah terdaftar." }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: "Gagal memperbarui lencana." }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = params.id;
    await prisma.badge.delete({ where: { id } });
    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch (error) {
    console.error("[DELETE_ADMIN_BADGE_ID]", error);
    return NextResponse.json({ success: false, error: "Gagal menghapus lencana." }, { status: 500 });
  }
}
