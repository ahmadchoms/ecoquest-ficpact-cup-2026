import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { adminMissionSchema, paginationSchema } from "@/lib/validations/admin";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());
    
    // Parse pagination and search
    const parsedParams = paginationSchema.safeParse(query);
    if (!parsedParams.success) {
      return NextResponse.json({ success: false, error: parsedParams.error.errors }, { status: 400 });
    }

    const { page, limit, search } = parsedParams.data;
    const skip = (page - 1) * limit;

    // Filter conditions
    const where = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    
    if (query.status && query.status !== "ALL") where.status = query.status;
    if (query.difficulty && query.difficulty !== "ALL") where.difficulty = query.difficulty;
    if (query.category && query.category !== "ALL") where.category = query.category;

    const [missions, total] = await Promise.all([
      prisma.mission.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          province: { select: { id: true, name: true } },
          badgeReward: { select: { id: true, name: true, icon: true } },
          _count: { select: { completions: true } }
        }
      }),
      prisma.mission.count({ where })
    ]);

    const formattedMissions = missions.map(m => ({
      ...m,
      completionsCount: m._count.completions
    }));

    return NextResponse.json({
      success: true,
      data: formattedMissions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("[GET_ADMIN_MISSIONS]", error);
    return NextResponse.json({ success: false, error: "Gagal memuat misi." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const parsedData = adminMissionSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json({ success: false, error: parsedData.error.errors }, { status: 400 });
    }

    const newMission = await prisma.mission.create({
      data: parsedData.data
    });

    return NextResponse.json({ success: true, data: newMission }, { status: 201 });

  } catch (error) {
    console.error("[POST_ADMIN_MISSIONS]", error);
    return NextResponse.json({ success: false, error: "Gagal menambahkan misi." }, { status: 500 });
  }
}
