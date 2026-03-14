import { successResponse, notFoundResponse, serverErrorResponse } from "@/lib/server/utils/response";
import { logger } from "@/lib/server/utils/logger";
import prisma from "@/lib/prisma";

/**
 * GET /api/user/missions/[id]
 * Get single mission detail
 */
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    logger.apiRequest("GET", `/api/user/missions/${id}`);

    const mission = await prisma.mission.findUnique({
      where: { id },
      include: {
        province: { select: { id: true, name: true, region: true, description: true } },
        badgeReward: { select: { id: true, name: true, rarity: true, icon: true, description: true } },
        _count: { select: { completions: true } },
      },
    });

    if (!mission) return notFoundResponse("Misi");

    logger.apiSuccess("GET", `/api/user/missions/${id}`);
    return successResponse(mission);
  } catch (error) {
    logger.apiError("GET", `/api/user/missions/${id}`, error);
    return serverErrorResponse("Gagal memuat detail misi.");
  }
}
