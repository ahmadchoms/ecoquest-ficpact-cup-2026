import {
  getClientIdentifier,
  checkRateLimit,
} from "@/lib/server/utils/rate-limit";
import {
  successResponse,
  errorResponse,
  serverErrorResponse,
} from "@/lib/server/utils/response";
import { logger } from "@/lib/server/utils/logger";
import { getLeaderboardUsers } from "@/lib/server/services/user.service";

export async function GET(request) {
  const clientId = getClientIdentifier(request);
  const { limited } = checkRateLimit(`leaderboard:${clientId}`, {
    maxRequests: 20,
  });

  if (limited) {
    return errorResponse("Terlalu banyak permintaan. Coba lagi nanti.", 429);
  }

  try {
    logger.apiRequest("GET", "/api/user/leaderboard");

    const users = await getLeaderboardUsers();

    logger.apiSuccess("GET", "/api/user/leaderboard", { count: users.length });
    return successResponse(users);
  } catch (error) {
    logger.apiError("GET", "/api/user/leaderboard", error);
    return serverErrorResponse("Gagal memuat papan peringkat.");
  }
}
