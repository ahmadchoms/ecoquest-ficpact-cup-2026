import {
  successResponse,
  errorResponse,
  serverErrorResponse,
} from "@/lib/server/utils/response";
import { logger } from "@/lib/server/utils/logger";
import { deactivateExpiredEventItems } from "@/lib/server/services/shopitem.service";

/**
 * GET /api/cron/sync-event-status
 *
 * Scheduled cron endpoint that deactivates shop items belonging to expired events.
 * Protected by the CRON_SECRET environment variable.
 * Must be called with: Authorization: Bearer <CRON_SECRET>
 *
 * Vercel Cron: runs every hour as configured in vercel.json
 */
export async function GET(request) {
  // Security check — only allow calls with the correct CRON_SECRET
  const authHeader = request.headers.get("authorization");
  const expectedToken = `Bearer ${process.env.CRON_SECRET}`;

  if (!process.env.CRON_SECRET || authHeader !== expectedToken) {
    logger.warn("Cron sync-event-status: Unauthorized attempt blocked.");
    return errorResponse("Unauthorized", 401);
  }

  try {
    logger.apiRequest("GET", "/api/cron/sync-event-status");

    const result = await deactivateExpiredEventItems();

    logger.apiSuccess("GET", "/api/cron/sync-event-status", result);

    return successResponse({
      message: "Sinkronisasi status event selesai.",
      ...result,
    });
  } catch (error) {
    logger.apiError("GET", "/api/cron/sync-event-status", error);
    return serverErrorResponse("Gagal sinkronisasi status event.");
  }
}
