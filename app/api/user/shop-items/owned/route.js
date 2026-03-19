import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  successResponse,
  errorResponse,
} from "@/lib/server/utils/response";
import { getUserPurchasedShopItems } from "@/lib/server/services/user.service";

/**
 * GET /api/user/shop-items/owned
 * Fetch user's purchased shop items
 */
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return errorResponse("Unauthorized", 401);
    }

    const purchasedItems = await getUserPurchasedShopItems(session.user.email);

    return successResponse(purchasedItems);
  } catch (error) {
    console.error("[GET /api/user/shop-items/owned]", error);
    return errorResponse(error.message, 500);
  }
}
