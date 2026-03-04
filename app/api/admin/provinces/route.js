import {
  checkRateLimit,
  getClientIdentifier,
} from "@/lib/server/utils/rate-limit";
import {
  successResponse,
  createdResponse,
  errorResponse,
  validationErrorResponse,
  conflictResponse,
  serverErrorResponse,
} from "@/lib/server/utils/response";
import { logger } from "@/lib/server/utils/logger";
import { adminProvinceSchema, paginationSchema } from "@/lib/validations/admin";
import {
  listProvinces,
  createProvince,
} from "@/lib/server/services/province.service";

export async function GET(request) {
  const clientId = getClientIdentifier(request);
  const { limited } = checkRateLimit(`provinces:${clientId}`, {
    maxRequests: 10,
  });
  if (limited)
    return errorResponse("Terlalu banyak permintaan. Coba lagi nanti.", 429);

  try {
    logger.apiRequest("GET", "/api/admin/provinces");

    const { searchParams } = new URL(request.url);
    const query = {};
    for (const [key, value] of searchParams.entries()) {
      if (query[key]) {
        if (Array.isArray(query[key])) query[key].push(value);
        else query[key] = [query[key], value];
      } else {
        query[key] = value;
      }
    }

    const parsedParams = paginationSchema.safeParse(query);
    if (!parsedParams.success)
      return validationErrorResponse(parsedParams.error);

    const { page, limit, search } = parsedParams.data;
    const result = await listProvinces({
      page,
      limit,
      search,
      threatLevel: query.threatLevel,
    });

    logger.apiSuccess("GET", "/api/admin/provinces", {
      total: result.meta.total,
    });
    return successResponse(result.data, result.meta);
  } catch (error) {
    logger.apiError("GET", "/api/admin/provinces", error);
    return serverErrorResponse("Gagal memuat provinsi.");
  }
}

export async function POST(request) {
  const clientId = getClientIdentifier(request);
  const { limited } = checkRateLimit(`provinces:${clientId}:mutate`, {
    maxRequests: 10,
  });
  if (limited)
    return errorResponse("Terlalu banyak permintaan. Coba lagi nanti.", 429);

  try {
    logger.apiRequest("POST", "/api/admin/provinces");

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return errorResponse("Format body JSON tidak valid", 400);
    }

    const parsedData = adminProvinceSchema.safeParse(body);
    if (!parsedData.success) return validationErrorResponse(parsedData.error);

    const newProvince = await createProvince(parsedData.data);

    logger.apiSuccess("POST", "/api/admin/provinces", { id: newProvince.id });
    return createdResponse(newProvince);
  } catch (error) {
    logger.apiError("POST", "/api/admin/provinces", error);
    if (error.code === "P2002")
      return conflictResponse("Nama provinsi sudah terdaftar.");
    return serverErrorResponse("Gagal menambahkan provinsi.");
  }
}
