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
import { adminUserSchema, paginationSchema } from "@/lib/validations/admin";
import { listUsers, createUser } from "@/lib/server/services/user.service";

export async function GET(request) {
  const clientId = getClientIdentifier(request);
  const { limited } = checkRateLimit(`users:${clientId}`, { maxRequests: 10 });
  if (limited)
    return errorResponse("Terlalu banyak permintaan. Coba lagi nanti.", 429);

  try {
    logger.apiRequest("GET", "/api/admin/users");

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
    const result = await listUsers({
      page,
      limit,
      search,
      role: query.role,
      status: query.status,
    });

    logger.apiSuccess("GET", "/api/admin/users", { total: result.meta.total });
    return successResponse(result.data, result.meta);
  } catch (error) {
    logger.apiError("GET", "/api/admin/users", error);
    return serverErrorResponse("Gagal memuat pengguna.");
  }
}

export async function POST(request) {
  try {
    logger.apiRequest("POST", "/api/admin/users");

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return errorResponse("Format body JSON tidak valid", 400);
    }

    const parsedData = adminUserSchema.safeParse(body);
    if (!parsedData.success) return validationErrorResponse(parsedData.error);

    const newUser = await createUser(parsedData.data);

    logger.apiSuccess("POST", "/api/admin/users", { id: newUser.id });
    return createdResponse(newUser);
  } catch (error) {
    logger.apiError("POST", "/api/admin/users", error);
    if (error.code === "P2002")
      return conflictResponse("Username atau Email sudah terdaftar.");
    if (error.message?.includes("Password wajib"))
      return errorResponse(error.message, 400);
    return serverErrorResponse("Gagal membuat pengguna.");
  }
}
