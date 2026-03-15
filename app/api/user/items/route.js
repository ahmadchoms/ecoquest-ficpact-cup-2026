import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  successResponse,
  errorResponse,
} from "@/lib/server/utils/response";
import { getUserItems, updateUserItemSelection } from "@/lib/server/services/user.service";

/**
 * GET /api/user/items
 * Fetch user's owned items (banners, borders) grouped by type
 */
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return errorResponse("Unauthorized", 401);
    }

    const items = await getUserItems(session.user.email);

    if (!items) {
      return errorResponse("User not found", 404);
    }

    return successResponse(items);
  } catch (error) {
    console.error("[GET /api/user/items]", error);
    return errorResponse(error.message, 500);
  }
}

/**
 * PUT /api/user/items
 * Update user's active banner and border selections
 * Body: { activeBannerId: string?, activeBorderId: string? }
 */
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await request.json();
    const { activeBannerId, activeBorderId } = body;

    const result = await updateUserItemSelection(
      session.user.email,
      activeBannerId || null,
      activeBorderId || null
    );

    return successResponse({
      message: "Items updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("[PUT /api/user/items]", error);
    return errorResponse(error.message, 500);
  }
}
