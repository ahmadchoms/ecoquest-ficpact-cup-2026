import { requireAdmin } from "@/lib/server/middlewares/auth";
import { checkRateLimit, getClientIdentifier } from "@/lib/server/utils/rate-limit";
import {
  successResponse, createdResponse, errorResponse,
  validationErrorResponse, serverErrorResponse,
} from "@/lib/server/utils/response";
import { logger } from "@/lib/server/utils/logger";
import { adminMissionSchema, paginationSchema } from "@/lib/validations/admin";
import { listMissions, createMission } from "@/lib/server/services/admin/mission.service";

export async function GET(request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  const clientId = getClientIdentifier(request);
  const { limited } = checkRateLimit(`missions:${clientId}`, { maxRequests: 30 });
  if (limited) return errorResponse("Terlalu banyak permintaan. Coba lagi nanti.", 429);

  try {
    logger.apiRequest("GET", "/api/admin/missions");

    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());

    const parsedParams = paginationSchema.safeParse(query);
    if (!parsedParams.success) return validationErrorResponse(parsedParams.error);

    const { page, limit, search } = parsedParams.data;
    const result = await listMissions({
      page, limit, search,
      status: query.status,
      difficulty: query.difficulty,
      category: query.category,
    });

    logger.apiSuccess("GET", "/api/admin/missions", { total: result.meta.total });
    return successResponse(result.data, result.meta);
  } catch (error) {
    logger.apiError("GET", "/api/admin/missions", error);
    return serverErrorResponse("Gagal memuat misi.");
  }
}

export async function POST(request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    logger.apiRequest("POST", "/api/admin/missions");

    const body = await request.json();
    const parsedData = adminMissionSchema.safeParse(body);
    if (!parsedData.success) return validationErrorResponse(parsedData.error);

    const newMission = await createMission(parsedData.data);

    logger.apiSuccess("POST", "/api/admin/missions", { id: newMission.id });
    return createdResponse(newMission);
  } catch (error) {
    logger.apiError("POST", "/api/admin/missions", error);
    return serverErrorResponse("Gagal menambahkan misi.");
  }
}
