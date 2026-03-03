import { requireAdmin } from "@/lib/server/middlewares/auth";
import {
  checkRateLimit,
  getClientIdentifier,
} from "@/lib/server/utils/rate-limit";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  notFoundResponse,
  conflictResponse,
  serverErrorResponse,
} from "@/lib/server/utils/response";
import { logger } from "@/lib/server/utils/logger";
import { adminBadgeSchema } from "@/lib/validations/admin";
import { getBadgeById, updateBadge, deleteBadge } from "@/lib/server/services/admin/badge.service";

export async function GET(request, { params }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    logger.apiRequest("GET", `/api/admin/badges/${id}`);

    const badge = await getBadgeById(id);
    if (!badge) return notFoundResponse("Lencana");

    logger.apiSuccess("GET", `/api/admin/badges/${id}`);
    return successResponse(badge);
  } catch (error) {
    logger.apiError("GET", `/api/admin/badges/[id]`, error);
    return serverErrorResponse("Gagal memuat lencana.");
  }
}

export async function PATCH(request, { params }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  const clientId = getClientIdentifier(request);
  const { limited } = checkRateLimit(`badges:${clientId}:mutate`, {
    maxRequests: 10,
  });
  if (limited)
    return errorResponse("Terlalu banyak permintaan. Coba lagi nanti.", 429);

  try {
    const { id } = await params;
    logger.apiRequest("PATCH", `/api/admin/badges/${id}`);

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return errorResponse("Format body JSON tidak valid", 400);
    }

    const parsedData = adminBadgeSchema.partial().safeParse(body);
    if (!parsedData.success) return validationErrorResponse(parsedData.error);

    const updatedBadge = await updateBadge(id, parsedData.data);

    logger.apiSuccess("PATCH", `/api/admin/badges/${id}`);
    return successResponse(updatedBadge);
  } catch (error) {
    logger.apiError("PATCH", `/api/admin/badges/[id]`, error);
    if (error.code === "P2002")
      return conflictResponse("Nama lencana sudah terdaftar.");
    if (error.code === "P2025") return notFoundResponse("Lencana");
    return serverErrorResponse("Gagal memperbarui lencana.");
  }
}

export async function DELETE(request, { params }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  const clientId = getClientIdentifier(request);
  const { limited } = checkRateLimit(`badges:${clientId}:mutate`, {
    maxRequests: 10,
  });
  if (limited)
    return errorResponse("Terlalu banyak permintaan. Coba lagi nanti.", 429);

  try {
    const { id } = await params;
    logger.apiRequest("DELETE", `/api/admin/badges/${id}`);

    await deleteBadge(id);

    logger.apiSuccess("DELETE", `/api/admin/badges/${id}`);
    return successResponse({ deleted: true });
  } catch (error) {
    logger.apiError("DELETE", `/api/admin/badges/[id]`, error);
    if (error.code === "P2025") return notFoundResponse("Lencana");
    return serverErrorResponse("Gagal menghapus lencana.");
  }
}
