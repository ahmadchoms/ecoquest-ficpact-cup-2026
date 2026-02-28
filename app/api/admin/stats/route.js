import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Total Users
    const totalUsers = await prisma.user.count({
      where: { role: "USER" },
    });

    // 2. Total active missions
    const activeMissions = await prisma.mission.count({
      where: { status: "ACTIVE" },
    });

    // 3. Current active provinces (those with at least one active mission)
    const activeProvinces = await prisma.province.count({
      where: {
        missions: {
          some: {
            status: "ACTIVE",
          },
        },
      },
    });

    // 4. Mission Completion Stats
    const totalCompletions = await prisma.missionCompletion.count();
    const completionRate =
      activeMissions > 0 && totalUsers > 0
        ? Math.round((totalCompletions / (activeMissions * totalUsers)) * 100)
        : 0;

    // 5. XP Awarded Today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const xpTodayResult = await prisma.missionCompletion.aggregate({
      where: {
        completedAt: {
          gte: today,
        },
      },
      _sum: {
        xpEarned: true,
      },
    });
    const xpToday = xpTodayResult._sum.xpEarned || 0;

    // 6. Get Pending missions for pipeline info
    const pendingMissionsCount = await prisma.mission.count({
      where: { status: "DRAFT" }
    });

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        activeMissions,
        activeProvinces,
        totalCompletions,
        completionRate: Math.min(completionRate, 100), // Cap at 100% just in case of multiple completions
        xpToday,
        pendingMissionsCount
      },
    });
  } catch (error) {
    console.error("[GET_ADMIN_STATS]", error);
    return NextResponse.json(
      { success: false, error: "Telah terjadi kesalahan saat memuat data statistik." },
      { status: 500 }
    );
  }
}
