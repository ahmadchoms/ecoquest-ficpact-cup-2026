import { requireAdmin } from "@/lib/server/middlewares/auth";
import {
  successResponse, validationErrorResponse, notFoundResponse,
  serverErrorResponse,
} from "@/lib/server/utils/response";
import { logger } from "@/lib/server/utils/logger";
import { adminMissionSchema } from "@/lib/validations/admin";
import { getMissionById, updateMission, deleteMission } from "@/lib/server/services/admin/mission.service";

export async function GET(request, { params }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

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
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    logger.apiRequest("PATCH", `/api/admin/missions/${id}`);

    const body = await request.json();
    const parsedData = adminMissionSchema.partial().safeParse(body);
    if (!parsedData.success) return validationErrorResponse(parsedData.error);

    const updatedMission = await updateMission(id, parsedData.data);

    logger.apiSuccess("PATCH", `/api/admin/missions/${id}`);
    return successResponse(updatedMission);
  } catch (error) {
    logger.apiError("PATCH", `/api/admin/missions/[id]`, error);
    return serverErrorResponse("Gagal memperbarui misi.");
  }
}

export async function DELETE(request, { params }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    logger.apiRequest("DELETE", `/api/admin/missions/${id}`);

    await deleteMission(id);

    logger.apiSuccess("DELETE", `/api/admin/missions/${id}`);
    return successResponse({ deleted: true });
  } catch (error) {
    logger.apiError("DELETE", `/api/admin/missions/[id]`, error);
    return serverErrorResponse("Gagal menghapus misi.");
  }
}
