import {
  checkRateLimit,
  getClientIdentifier,
} from "@/lib/server/utils/rate-limit";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  notFoundResponse,
  serverErrorResponse,
} from "@/lib/server/utils/response";
import { logger } from "@/lib/server/utils/logger";
import { adminMissionSchema } from "@/lib/validations/admin";
import {
  getMissionById,
  updateMission,
  deleteMission,
} from "@/lib/server/services/mission.service";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    logger.apiRequest("GET", `/api/admin/missions/${id}`);

    const mission = await getMissionById(id);
    if (!mission) return notFoundResponse("Misi");

    logger.apiSuccess("GET", `/api/admin/missions/${id}`);
    return successResponse(mission);
  } catch (error) {
    logger.apiError("GET", `/api/admin/missions/[id]`, error);
    return serverErrorResponse("Gagal memuat misi.");
  }
}

export async function PATCH(request, { params }) {
  const clientId = getClientIdentifier(request);
  const { limited } = checkRateLimit(`missions:${clientId}:mutate`, {
    maxRequests: 10,
  });
  if (limited)
    return errorResponse("Terlalu banyak permintaan. Coba lagi nanti.", 429);

  try {
    const { id } = await params;
    logger.apiRequest("PATCH", `/api/admin/missions/${id}`);

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return errorResponse("Format body JSON tidak valid", 400);
    }

    const parsedData = adminMissionSchema.partial().safeParse(body);
    if (!parsedData.success) return validationErrorResponse(parsedData.error);

    const updatedMission = await updateMission(id, parsedData.data);

    logger.apiSuccess("PATCH", `/api/admin/missions/${id}`);
    return successResponse(updatedMission);
  } catch (error) {
    logger.apiError("PATCH", `/api/admin/missions/[id]`, error);
    if (error.code === "P2025") return notFoundResponse("Misi");
    return serverErrorResponse("Gagal memperbarui misi.");
  }
}

export async function DELETE(request, { params }) {
  const clientId = getClientIdentifier(request);
  const { limited } = checkRateLimit(`missions:${clientId}:mutate`, {
    maxRequests: 10,
  });
  if (limited)
    return errorResponse("Terlalu banyak permintaan. Coba lagi nanti.", 429);

  try {
    const { id } = await params;
    logger.apiRequest("DELETE", `/api/admin/missions/${id}`);

    await deleteMission(id);

    logger.apiSuccess("DELETE", `/api/admin/missions/${id}`);
    return successResponse({ deleted: true });
  } catch (error) {
    logger.apiError("DELETE", `/api/admin/missions/[id]`, error);
    if (error.code === "P2025") return notFoundResponse("Misi");
    return serverErrorResponse("Gagal menghapus misi.");
  }
}
