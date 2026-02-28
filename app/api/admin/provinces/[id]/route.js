import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { adminProvinceSchema } from "@/lib/validations/admin";

export async function GET(request, { params }) {
  try {
    const id = params.id;
    const province = await prisma.province.findUnique({
      where: { id },
      include: {
        missions: {
          select: { id: true, title: true, status: true, difficulty: true }
        }
      }
    });

    if (!province) return NextResponse.json({ success: false, error: "Provinsi tidak ditemukan." }, { status: 404 });

    return NextResponse.json({ success: true, data: province });
  } catch (error) {
    console.error("[GET_ADMIN_PROVINCE_ID]", error);
    return NextResponse.json({ success: false, error: "Gagal memuat provinsi." }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const id = params.id;
    const body = await request.json();
    
    const parsedData = adminProvinceSchema.partial().safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json({ success: false, error: parsedData.error.errors }, { status: 400 });
    }

    const updatedProvince = await prisma.province.update({
      where: { id },
      data: parsedData.data
    });

    return NextResponse.json({ success: true, data: updatedProvince });
  } catch (error) {
    console.error("[PATCH_ADMIN_PROVINCE_ID]", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ success: false, error: "Nama provinsi sudah terdaftar." }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: "Gagal memperbarui provinsi." }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = params.id;
    await prisma.province.delete({ where: { id } });
    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch (error) {
    console.error("[DELETE_ADMIN_PROVINCE_ID]", error);
    return NextResponse.json({ success: false, error: "Gagal menghapus provinsi." }, { status: 500 });
  }
}
