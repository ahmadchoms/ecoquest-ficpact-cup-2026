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
import { adminProvinceSchema } from "@/lib/validations/admin";
import { getProvinceById, updateProvince, deleteProvince } from "@/lib/server/services/admin/province.service";

export async function GET(request, { params }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    logger.apiRequest("GET", `/api/admin/provinces/${id}`);

    const province = await getProvinceById(id);
    if (!province) return notFoundResponse("Provinsi");

    logger.apiSuccess("GET", `/api/admin/provinces/${id}`);
    return successResponse(province);
  } catch (error) {
    logger.apiError("GET", `/api/admin/provinces/[id]`, error);
    return serverErrorResponse("Gagal memuat provinsi.");
  }
}

export async function PATCH(request, { params }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  const clientId = getClientIdentifier(request);
  const { limited } = checkRateLimit(`provinces:${clientId}:mutate`, {
    maxRequests: 10,
  });
  if (limited)
    return errorResponse("Terlalu banyak permintaan. Coba lagi nanti.", 429);

  try {
    const { id } = await params;
    logger.apiRequest("PATCH", `/api/admin/provinces/${id}`);

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return errorResponse("Format body JSON tidak valid", 400);
    }

    const parsedData = adminProvinceSchema.partial().safeParse(body);
    if (!parsedData.success) return validationErrorResponse(parsedData.error);

    const updatedProvince = await updateProvince(id, parsedData.data);

    logger.apiSuccess("PATCH", `/api/admin/provinces/${id}`);
    return successResponse(updatedProvince);
  } catch (error) {
    logger.apiError("PATCH", `/api/admin/provinces/[id]`, error);
    if (error.code === "P2002")
      return conflictResponse("Nama provinsi sudah terdaftar.");
    if (error.code === "P2025") return notFoundResponse("Provinsi");
    return serverErrorResponse("Gagal memperbarui provinsi.");
  }
}

export async function DELETE(request, { params }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  const clientId = getClientIdentifier(request);
  const { limited } = checkRateLimit(`provinces:${clientId}:mutate`, {
    maxRequests: 10,
  });
  if (limited)
    return errorResponse("Terlalu banyak permintaan. Coba lagi nanti.", 429);

  try {
    const { id } = await params;
    logger.apiRequest("DELETE", `/api/admin/provinces/${id}`);

    await deleteProvince(id);

    logger.apiSuccess("DELETE", `/api/admin/provinces/${id}`);
    return successResponse({ deleted: true });
  } catch (error) {
    logger.apiError("DELETE", `/api/admin/provinces/[id]`, error);
    if (error.code === "P2025") return notFoundResponse("Provinsi");
    return serverErrorResponse("Gagal menghapus provinsi.");
  }
}
