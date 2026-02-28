import { requireAdmin } from "@/lib/server/middlewares/auth";
import {
  successResponse, errorResponse,
  validationErrorResponse, notFoundResponse,
  conflictResponse, serverErrorResponse,
} from "@/lib/server/utils/response";
import { logger } from "@/lib/server/utils/logger";
import { adminUserSchema } from "@/lib/validations/admin";
import { getUserById, updateUser, deleteUser } from "@/lib/server/services/admin/user.service";

export async function GET(request, { params }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    logger.apiRequest("GET", `/api/admin/users/${id}`);

    const user = await getUserById(id);
    if (!user) return notFoundResponse("User");

    logger.apiSuccess("GET", `/api/admin/users/${id}`);
    return successResponse(user);
  } catch (error) {
    logger.apiError("GET", `/api/admin/users/[id]`, error);
    return serverErrorResponse("Gagal memuat pengguna.");
  }
}

export async function PATCH(request, { params }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    logger.apiRequest("PATCH", `/api/admin/users/${id}`);

    const body = await request.json();
    const parsedData = adminUserSchema.partial().safeParse(body);
    if (!parsedData.success) return validationErrorResponse(parsedData.error);

    const updatedUser = await updateUser(id, parsedData.data);

    logger.apiSuccess("PATCH", `/api/admin/users/${id}`);
    return successResponse(updatedUser);
  } catch (error) {
    logger.apiError("PATCH", `/api/admin/users/[id]`, error);
    if (error.code === "P2002") return conflictResponse("Username atau Email sudah terdaftar.");
    return serverErrorResponse("Gagal memperbarui pengguna.");
  }
}

export async function DELETE(request, { params }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    logger.apiRequest("DELETE", `/api/admin/users/${id}`);

    await deleteUser(id);

    logger.apiSuccess("DELETE", `/api/admin/users/${id}`);
    return successResponse({ deleted: true });
  } catch (error) {
    logger.apiError("DELETE", `/api/admin/users/[id]`, error);
    return serverErrorResponse("Gagal menghapus pengguna.");
  }
}
