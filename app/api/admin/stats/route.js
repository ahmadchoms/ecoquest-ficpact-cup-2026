import { requireAdmin } from "@/lib/server/middlewares/auth";
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
import { getDashboardStats } from "@/lib/server/services/admin/stats.service";

export async function GET(request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  const clientId = getClientIdentifier(request);
  const { limited } = checkRateLimit(`stats:${clientId}`, { maxRequests: 10 });
  if (limited)
    return errorResponse("Terlalu banyak permintaan. Coba lagi nanti.", 429);

  try {
    logger.apiRequest("GET", "/api/admin/stats");
    const data = await getDashboardStats();
    logger.apiSuccess("GET", "/api/admin/stats");
    return successResponse(data);
  } catch (error) {
    logger.apiError("GET", "/api/admin/stats", error);
    return serverErrorResponse(
      "Telah terjadi kesalahan saat memuat data statistik.",
    );
  }
}
