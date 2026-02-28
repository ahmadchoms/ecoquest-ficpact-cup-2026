import { requireAdmin } from "@/lib/server/middlewares/auth";
import { checkRateLimit, getClientIdentifier } from "@/lib/server/utils/rate-limit";
import {
  successResponse, createdResponse, errorResponse,
  validationErrorResponse, conflictResponse, serverErrorResponse,
} from "@/lib/server/utils/response";
import { logger } from "@/lib/server/utils/logger";
import { adminBadgeSchema, paginationSchema } from "@/lib/validations/admin";
import { listBadges, createBadge } from "@/lib/server/services/admin/badge.service";

export async function GET(request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  const clientId = getClientIdentifier(request);
  const { limited } = checkRateLimit(`badges:${clientId}`, { maxRequests: 30 });
  if (limited) return errorResponse("Terlalu banyak permintaan. Coba lagi nanti.", 429);

  try {
    logger.apiRequest("GET", "/api/admin/badges");

    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());

    const parsedParams = paginationSchema.safeParse(query);
    if (!parsedParams.success) return validationErrorResponse(parsedParams.error);

    const { page, limit, search } = parsedParams.data;
    const result = await listBadges({ page, limit, search, rarity: query.rarity, category: query.category });

    logger.apiSuccess("GET", "/api/admin/badges", { total: result.meta.total });
    return successResponse(result.data, result.meta);
  } catch (error) {
    logger.apiError("GET", "/api/admin/badges", error);
    return serverErrorResponse("Gagal memuat lencana.");
  }
}

export async function POST(request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    logger.apiRequest("POST", "/api/admin/badges");

    const body = await request.json();
    const parsedData = adminBadgeSchema.safeParse(body);
    if (!parsedData.success) return validationErrorResponse(parsedData.error);

    const newBadge = await createBadge(parsedData.data);

    logger.apiSuccess("POST", "/api/admin/badges", { id: newBadge.id });
    return createdResponse(newBadge);
  } catch (error) {
    logger.apiError("POST", "/api/admin/badges", error);
    if (error.code === "P2002") return conflictResponse("Nama lencana sudah terdaftar.");
    return serverErrorResponse("Gagal menambahkan lencana.");
  }
}
