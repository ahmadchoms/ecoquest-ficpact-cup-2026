import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { adminMissionSchema } from "@/lib/validations/admin";

export async function GET(request, { params }) {
  try {
    const id = params.id;
    const mission = await prisma.mission.findUnique({
      where: { id },
      include: {
        province: { select: { id: true, name: true, region: true } },
        badgeReward: { select: { id: true, name: true, rarity: true, icon: true } },
      }
    });

    if (!mission) return NextResponse.json({ success: false, error: "Misi tidak ditemukan." }, { status: 404 });

    return NextResponse.json({ success: true, data: mission });
  } catch (error) {
    console.error("[GET_ADMIN_MISSION_ID]", error);
    return NextResponse.json({ success: false, error: "Gagal memuat misi." }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const id = params.id;
    const body = await request.json();
    
    const parsedData = adminMissionSchema.partial().safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json({ success: false, error: parsedData.error.errors }, { status: 400 });
    }

    const updatedMission = await prisma.mission.update({
      where: { id },
      data: parsedData.data
    });

    return NextResponse.json({ success: true, data: updatedMission });
  } catch (error) {
    console.error("[PATCH_ADMIN_MISSION_ID]", error);
    return NextResponse.json({ success: false, error: "Gagal memperbarui misi." }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = params.id;
    await prisma.mission.delete({ where: { id } });
    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch (error) {
    console.error("[DELETE_ADMIN_MISSION_ID]", error);
    return NextResponse.json({ success: false, error: "Gagal menghapus misi." }, { status: 500 });
  }
}
