import { getServerSession } from "next-auth/next";
import { successResponse, errorResponse, serverErrorResponse } from "@/lib/server/utils/response";
import { logger } from "@/lib/server/utils/logger";
import prisma from "@/lib/prisma";

/**
 * GET /api/user/items
 * Get all items owned by current user
 */
export async function GET(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return errorResponse("Tidak terautentikasi", 401);
    }

    logger.apiRequest("GET", "/api/user/items");

    const userItems = await prisma.userItem.findMany({
      where: { userId: session.user.id },
      include: {
        item: {
          select: {
            id: true,
            name: true,
            description: true,
            type: true,
            price: true,
            content: true,
            previewUrl: true,
          },
        },
      },
      orderBy: { acquiredAt: "desc" },
    });

    logger.apiSuccess("GET", "/api/user/items", {
      total: userItems.length,
    });

    return successResponse(userItems);
  } catch (error) {
    logger.apiError("GET", "/api/user/items", error);
    return serverErrorResponse("Gagal memuat item milik Anda.");
  }
}
