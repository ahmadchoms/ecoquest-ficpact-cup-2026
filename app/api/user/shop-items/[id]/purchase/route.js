import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { successResponse, errorResponse, notFoundResponse, serverErrorResponse } from "@/lib/server/utils/response";
import { logger } from "@/lib/server/utils/logger";
import prisma from "@/lib/prisma";

/**
 * POST /api/user/shop-items/[id]/purchase
 * Purchase a shop item
 * Body: {} (empty, auth from session)
 */
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return errorResponse("Tidak terautentikasi", 401);
    }

    const { id } = await params;
    logger.apiRequest("POST", `/api/user/shop-items/${id}/purchase`);

    // Get shop item
    const shopItem = await prisma.shopItem.findUnique({
      where: { id },
    });

    if (!shopItem) return notFoundResponse("Item Toko");

    if (!shopItem.isActive) {
      return errorResponse("Item ini tidak tersedia lagi.", 400);
    }

    // Check if already purchased
    const existing = await prisma.userItem.findUnique({
      where: { userId_itemId: { userId: session.user.id, itemId: id } },
    });

    if (existing) {
      return errorResponse("Anda sudah membeli item ini sebelumnya.", 400);
    }

    // Get user's current points
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { points: true },
    });

    if (user.points < shopItem.price) {
      return errorResponse("Poin Anda tidak cukup untuk membeli item ini.", 400);
    }

    // Purchase in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user item record
      const userItem = await tx.userItem.create({
        data: {
          userId: session.user.id,
          itemId: id,
        },
      });

      // Deduct points from user
      const updatedUser = await tx.user.update({
        where: { id: session.user.id },
        data: {
          points: { decrement: shopItem.price },
        },
      });

      return {
        userItem,
        remainingPoints: updatedUser.points,
      };
    });

    logger.apiSuccess("POST", `/api/user/shop-items/${id}/purchase`, {
      itemId: id,
      price: shopItem.price,
    });

    return successResponse(result);
  } catch (error) {
    logger.apiError("POST", `/api/user/shop-items/[id]/purchase`, error);
    return serverErrorResponse("Gagal membeli item.");
  }
}
