import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { adminBadgeSchema, paginationSchema } from "@/lib/validations/admin";

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
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    
    if (query.rarity && query.rarity !== "ALL") where.rarity = query.rarity;
    if (query.category && query.category !== "ALL") where.category = query.category;

    const [badges, total] = await Promise.all([
      prisma.badge.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
        include: {
          _count: { select: { users: true } }
        }
      }),
      prisma.badge.count({ where })
    ]);

    const formattedBadges = badges.map(b => ({
      ...b,
      usersCount: b._count.users
    }));

    return NextResponse.json({
      success: true,
      data: formattedBadges,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("[GET_ADMIN_BADGES]", error);
    return NextResponse.json({ success: false, error: "Gagal memuat lencana." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const parsedData = adminBadgeSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json({ success: false, error: parsedData.error.errors }, { status: 400 });
    }

    const newBadge = await prisma.badge.create({
      data: parsedData.data
    });

    return NextResponse.json({ success: true, data: newBadge }, { status: 201 });

  } catch (error) {
    console.error("[POST_ADMIN_BADGES]", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ success: false, error: "Nama lencana sudah terdaftar." }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: "Gagal menambahkan lencana." }, { status: 500 });
  }
}
