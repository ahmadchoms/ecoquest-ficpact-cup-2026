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
import {
  getAnalyticsSummary,
  getParticipationTrend,
  getRegionalVolume,
} from "@/lib/server/services/analytics.service";

export async function GET(request) {
  const clientId = getClientIdentifier(request);
  const { limited } = checkRateLimit(`analytics:${clientId}`, {
    maxRequests: 10,
  });
  if (limited)
    return errorResponse("Terlalu banyak permintaan. Coba lagi nanti.", 429);

  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") || "7d";

  try {
    logger.apiRequest("GET", `/api/admin/analytics?range=${range}`);

    const [summary, trend, regional] = await Promise.all([
      getAnalyticsSummary(range),
      getParticipationTrend(range),
      getRegionalVolume(range),
    ]);

    logger.apiSuccess("GET", "/api/admin/analytics");
    return successResponse({ summary, trend, regional });
  } catch (error) {
    logger.apiError("GET", "/api/admin/analytics", error);
    return serverErrorResponse(
      "Telah terjadi kesalahan saat memuat data analitik.",
    );
  }
}
