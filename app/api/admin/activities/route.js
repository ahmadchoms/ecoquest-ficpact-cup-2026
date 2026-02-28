import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const defaultLimit = 5;

    const recentCompletions = await prisma.missionCompletion.findMany({
      orderBy: {
        completedAt: 'desc'
      },
      take: defaultLimit,
      include: {
        user: {
          select: {
            username: true,
            profileImage: true,
          }
        },
        mission: {
          select: {
            title: true,
            icon: true,
            color: true,
            category: true
          }
        }
      }
    });

    // Transform to match UI expectations
    const formattedActivities = recentCompletions.map(c => ({
      id: c.id,
      user_id: c.userId,
      username: c.user.username,
      action: `Menyelesaikan misi "${c.mission.title}"`,
      timestamp: c.completedAt.toISOString(),
      type: "mission_completion",
      xp_earned: c.xpEarned,
      mission_category: c.mission.category
    }));

    return NextResponse.json({ success: true, data: formattedActivities });
  } catch (error) {
    console.error("[GET_ADMIN_ACTIVITIES]", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat aktivitas terbaru." },
      { status: 500 }
    );
  }
}
