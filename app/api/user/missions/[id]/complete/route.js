import { getServerSession } from "next-auth/next";
import { successResponse, errorResponse, notFoundResponse, serverErrorResponse } from "@/lib/server/utils/response";
import { logger } from "@/lib/server/utils/logger";
import prisma from "@/lib/prisma";
import { calculatePerformanceReward } from "@/data/missions";

/**
 * POST /api/user/missions/[id]/complete
 * Complete a mission and record it in database
 * Body: { performanceScore: number (0-100) }
 */
export async function POST(request, { params }) {
  try {
    const session = await getServerSession();
    if (!session) {
      return errorResponse("Tidak terautentikasi", 401);
    }

    const { id } = await params;
    const { performanceScore } = await request.json();

    logger.apiRequest("POST", `/api/user/missions/${id}/complete`);

    // Get mission
    const mission = await prisma.mission.findUnique({
      where: { id },
    });

    if (!mission) return notFoundResponse("Misi");

    // Check if already completed
    const existing = await prisma.missionCompletion.findUnique({
      where: { userId_missionId: { userId: session.user.id, missionId: id } },
    });

    if (existing) {
      return errorResponse("Anda sudah menyelesaikan misi ini sebelumnya.", 400);
    }

    // Calculate earned rewards based on performance
    const { earnedXP, earnedPoints } = calculatePerformanceReward(
      performanceScore,
      mission.xpReward,
      mission.pointsReward
    );

    // Create mission completion record in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Record completion
      const completion = await tx.missionCompletion.create({
        data: {
          userId: session.user.id,
          missionId: id,
          xpEarned: earnedXP,
        },
      });

      // Update user XP and points
      const updatedUser = await tx.user.update({
        where: { id: session.user.id },
        data: {
          xp: { increment: earnedXP },
          points: { increment: earnedPoints },
        },
      });

      // Award badge if mission has one
      if (mission.badgeRewardId) {
        await tx.user.update({
          where: { id: session.user.id },
          data: {
            badges: { connect: { id: mission.badgeRewardId } },
          },
        });
      }

      return {
        completion,
        earnedXP,
        earnedPoints,
        newLevel: Math.floor(updatedUser.xp / 500) + 1,
      };
    });

    logger.apiSuccess("POST", `/api/user/missions/${id}/complete`, {
      earnedXP: result.earnedXP,
      earnedPoints: result.earnedPoints,
    });

    return successResponse(result);
  } catch (error) {
    logger.apiError("POST", `/api/user/missions/[id]/complete`, error);
    return serverErrorResponse("Gagal menyelesaikan misi.");
  }
}
