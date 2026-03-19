import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  notFoundResponse,
  serverErrorResponse,
} from "@/lib/server/utils/response";
import { logger } from "@/lib/server/utils/logger";
import {
  checkRateLimit,
  getClientIdentifier,
} from "@/lib/server/utils/rate-limit";
import { getNavbarUserData } from "@/lib/server/services/user.service";

/**
 * GET /api/user/navbar
 * Fetch navbar user data (name, xp, points, level, profileImage)
 */
export async function GET(request) {
  const clientId = getClientIdentifier(request);
  const { limited } = checkRateLimit(`navbar:${clientId}`, {
    maxRequests: 60,
  });
  if (limited)
    return errorResponse("Terlalu banyak permintaan. Coba lagi nanti.", 429);

  try {
    logger.apiRequest("GET", "/api/user/navbar");

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      logger.apiError("GET", "/api/user/navbar", "Unauthorized");
      return unauthorizedResponse("Silakan login terlebih dahulu");
    }

    const user = await getNavbarUserData(session.user.email);
    if (!user) {
      return notFoundResponse("Pengguna");
    }

    logger.apiSuccess("GET", "/api/user/navbar", "Navbar data fetched");
    return successResponse(user);
  } catch (error) {
    logger.apiError("GET", "/api/user/navbar", error.message);
    return serverErrorResponse("Gagal mengambil data navbar");
  }
}