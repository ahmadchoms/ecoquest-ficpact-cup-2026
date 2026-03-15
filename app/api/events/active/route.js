import { successResponse, serverErrorResponse } from "@/lib/server/utils/response";
import { logger } from "@/lib/server/utils/logger";
import prisma from "@/lib/prisma";

/**
 * GET /api/events/active
 * Get all active events where endDate has not passed
 */
export async function GET(request) {
  try {
    logger.apiRequest("GET", "/api/events/active");

    const now = new Date();

    const activeEvents = await prisma.event.findMany({
      where: {
        isActive: true,
        endDate: {
          gt: now, // endDate harus lebih besar dari sekarang
        },
      },
      include: {
        items: {
          where: { isActive: true },
          select: { id: true, name: true },
        },
      },
      orderBy: { startDate: "desc" },
    });

    logger.apiSuccess("GET", "/api/events/active", {
      total: activeEvents.length,
    });

    return successResponse(activeEvents);
  } catch (error) {
    logger.apiError("GET", "/api/events/active", error);
    return serverErrorResponse("Gagal memuat event aktif.");
  }
}
