import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { adminUserSchema, paginationSchema } from "@/lib/validations/admin";

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
        { username: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }
    
    // Additional filters (could be passed in query)
    if (query.role && query.role !== "ALL") {
      where.role = query.role;
    }
    if (query.status && query.status !== "ALL") {
      where.status = query.status;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          status: true,
          level: true,
          xp: true,
          profileImage: true,
          createdAt: true,
        }
      }),
      prisma.user.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("[GET_ADMIN_USERS]", error);
    return NextResponse.json({ success: false, error: "Gagal memuat pengguna." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const parsedData = adminUserSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json({ success: false, error: parsedData.error.errors }, { status: 400 });
    }

    // Usually hash password here via bcrypt. For dummy purpose we skip hashing if not provided
    const password = parsedData.data.password || "defaultpassword123";

    const newUser = await prisma.user.create({
      data: {
        username: parsedData.data.username,
        email: parsedData.data.email,
        password: password, // In production ALWAYS hash
        role: parsedData.data.role,
        status: parsedData.data.status,
        level: parsedData.data.level,
        xp: parsedData.data.xp,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
      }
    });

    return NextResponse.json({ success: true, data: newUser }, { status: 201 });

  } catch (error) {
    console.error("[POST_ADMIN_USERS]", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ success: false, error: "Username atau Email sudah terdaftar." }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: "Gagal membuat pengguna." }, { status: 500 });
  }
}
