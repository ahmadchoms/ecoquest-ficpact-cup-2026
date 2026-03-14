import { successResponse, errorResponse, serverErrorResponse } from "@/lib/server/utils/response";
import { logger } from "@/lib/server/utils/logger";
import prisma from "@/lib/prisma";

/**
 * GET /api/user/missions
 * Get all available missions for the user
 */
export async function GET(request) {
  try {
    logger.apiRequest("GET", "/api/user/missions");

    const missions = await prisma.mission.findMany({
      where: { status: "ACTIVE" },
      include: {
        province: { select: { id: true, name: true, region: true } },
        badgeReward: { select: { id: true, name: true, rarity: true, icon: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    logger.apiSuccess("GET", "/api/user/missions", {
      total: missions.length,
    });

    return successResponse(missions);
  } catch (error) {
    logger.apiError("GET", "/api/user/missions", error);
    return serverErrorResponse("Gagal memuat misi.");
  }
}
