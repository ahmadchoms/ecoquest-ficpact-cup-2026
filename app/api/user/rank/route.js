import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  successResponse,
  unauthorizedResponse,
  notFoundResponse,
  serverErrorResponse,
} from "@/lib/server/utils/response";
import { logger } from "@/lib/server/utils/logger";
import { getUserRank } from "@/lib/server/services/user.service";

/**
 * GET /api/user/rank
 * Get authenticated user's rank in leaderboard
 */
export async function GET(request) {
  try {
    logger.apiRequest("GET", "/api/user/rank");

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      logger.apiError("GET", "/api/user/rank", "Unauthorized");
      return unauthorizedResponse("Silakan login terlebih dahulu");
    }

    const userRank = await getUserRank(session.user.email);
    if (!userRank) {
      return notFoundResponse("Data pengguna");
    }

    logger.apiSuccess("GET", "/api/user/rank", { rank: userRank.rank });
    return successResponse(userRank);
  } catch (error) {
    logger.apiError("GET", "/api/user/rank", error);
    return serverErrorResponse("Gagal memuat rank pengguna");
  }
}
