import { successResponse, errorResponse, serverErrorResponse } from "@/lib/server/utils/response";
import { logger } from "@/lib/server/utils/logger";
import prisma from "@/lib/prisma";
import { enrichShopItemsWithRarity } from "@/lib/server/utils/shop-rarity";

/**
 * GET /api/user/shop-items
 * Get all available shop items for user to purchase
 */
export async function GET(request) {
  try {
    logger.apiRequest("GET", "/api/user/shop-items");

    const shopItems = await prisma.shopItem.findMany({
      where: { isActive: true },
      include: {
        event: { select: { id: true, name: true, isActive: true } },
        _count: { select: { purchases: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Enrich items dengan rarity berdasarkan eventId
    const enrichedItems = enrichShopItemsWithRarity(shopItems);

    logger.apiSuccess("GET", "/api/user/shop-items", {
      total: enrichedItems.length,
    });

    return successResponse(enrichedItems);
  } catch (error) {
    logger.apiError("GET", "/api/user/shop-items", error);
    return serverErrorResponse("Gagal memuat item toko.");
  }
}
