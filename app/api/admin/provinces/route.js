import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { adminProvinceSchema, paginationSchema } from "@/lib/validations/admin";

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
        { region: { contains: search, mode: "insensitive" } },
      ];
    }
    
    if (query.threatLevel && query.threatLevel !== "ALL") {
      where.threatLevel = query.threatLevel;
    }

    const [provinces, total] = await Promise.all([
      prisma.province.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
        include: {
          _count: {
            select: { missions: true }
          }
        }
      }),
      prisma.province.count({ where })
    ]);

    // Transform count for frontend display
    const formattedProvinces = provinces.map(p => ({
      ...p,
      missionsCount: p._count.missions
    }));

    return NextResponse.json({
      success: true,
      data: formattedProvinces,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("[GET_ADMIN_PROVINCES]", error);
    return NextResponse.json({ success: false, error: "Gagal memuat provinsi." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const parsedData = adminProvinceSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json({ success: false, error: parsedData.error.errors }, { status: 400 });
    }

    const newProvince = await prisma.province.create({
      data: parsedData.data
    });

    return NextResponse.json({ success: true, data: newProvince }, { status: 201 });

  } catch (error) {
    console.error("[POST_ADMIN_PROVINCES]", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ success: false, error: "Nama provinsi sudah terdaftar." }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: "Gagal menambahkan provinsi." }, { status: 500 });
  }
}
