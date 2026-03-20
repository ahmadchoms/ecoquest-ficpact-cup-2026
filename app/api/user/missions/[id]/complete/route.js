import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
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
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return errorResponse("Tidak terautentikasi", 401);
    }

    const { id } = await params;
    const { performanceScore } = await request.json();

    logger.apiRequest("POST", `/api/user/missions/${id}/complete`);

    const mission = await prisma.mission.findUnique({
      where: { id },
      include: { badgeReward: true },
    });

    if (!mission) return notFoundResponse("Misi");

    const { earnedXP: rawXP, earnedPoints: rawPoints } = calculatePerformanceReward(
      performanceScore,
      mission.xpReward,
      mission.pointsReward || 0
    );

    const earnedXP = Math.floor(rawXP);
    const earnedPoints = Math.floor(rawPoints);

    try {
      const result = await prisma.$transaction(async (tx) => {
        const completion = await tx.missionCompletion.create({
          data: {
            userId: session.user.id,
            missionId: id,
            xpEarned: earnedXP,
            pointsEarned: earnedPoints,
          },
        });

        const updatedUser = await tx.user.update({
          where: { id: session.user.id },
          data: {
            xp: { increment: earnedXP },
            points: { increment: earnedPoints },
          },
        });

        if (mission.badgeRewardId) {
          await tx.user.update({
            where: { id: session.user.id },
            data: {
              badges: { connect: { id: mission.badgeRewardId } },
            },
          });
        }

        const previousXP = updatedUser.xp - earnedXP;
        const oldLevel = Math.floor(previousXP / 500) + 1;
        const newLevel = Math.floor(updatedUser.xp / 500) + 1;

        return {
          completion,
          earnedXP,
          earnedPoints,
          newLevel,
          isLevelUp: newLevel > oldLevel,
          badge: mission.badgeReward || null,
        };
      });

      logger.apiSuccess("POST", `/api/user/missions/${id}/complete`, {
        earnedXP: result.earnedXP,
        earnedPoints: result.earnedPoints,
      });

      return successResponse(result);
    } catch (error) {
      if (error.code === "P2002") {
        return errorResponse("Anda sudah menyelesaikan misi ini sebelumnya.", 400);
      }
      throw error;
    }
  } catch (error) {
    logger.apiError("POST", `/api/user/missions/[id]/complete`, error);
    return serverErrorResponse("Gagal menyelesaikan misi.");
  }
}
