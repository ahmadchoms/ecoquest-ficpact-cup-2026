import {
  checkRateLimit,
  getClientIdentifier,
} from "@/lib/server/utils/rate-limit";
import {
  successResponse,
  errorResponse,
  serverErrorResponse,
} from "@/lib/server/utils/response";
import { logger } from "@/lib/server/utils/logger";
import { getRecentActivities } from "@/lib/server/services/activity.service";

export async function GET(request) {
  const clientId = getClientIdentifier(request);
  const { limited } = checkRateLimit(`activities:${clientId}`, {
    maxRequests: 10,
  });
  if (limited)
    return errorResponse("Terlalu banyak permintaan. Coba lagi nanti.", 429);

  try {
    logger.apiRequest("GET", "/api/admin/activities");
    const data = await getRecentActivities();
    logger.apiSuccess("GET", "/api/admin/activities", { count: data.length });
    return successResponse(data);
  } catch (error) {
    logger.apiError("GET", "/api/admin/activities", error);
    return serverErrorResponse("Gagal memuat aktivitas terbaru.");
  }
}
