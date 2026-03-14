import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  notFoundResponse,
  conflictResponse,
  serverErrorResponse,
} from "@/lib/server/utils/response";
import { logger } from "@/lib/server/utils/logger";
import { adminUserSchema } from "@/lib/validations/admin";
import { parseFormData } from "@/lib/server/utils/formdata";
import {
  STORAGE_BUCKETS,
  STORAGE_FOLDERS,
  uploadToStorage,
  deleteFromStorage,
} from "@/lib/storage";
import {
  getUserById,
  updateUser,
  deleteUser,
} from "@/lib/server/services/user.service";

export async function GET(request, { params }) {
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
  try {
    const { id } = await params;
    logger.apiRequest("PATCH", `/api/admin/users/${id}`);

    const user = await getUserById(id);
    if (!user) return notFoundResponse("User");

    const formData = await request.formData();
    const { fields, files } = parseFormData(formData, adminUserSchema.partial());

    const parsedData = adminUserSchema.partial().safeParse(fields);
    if (!parsedData.success) return validationErrorResponse(parsedData.error);

    let profileUrl = null;
    let oldProfileUrl = user.profileImage;
    const profileFile = files.profileImage;

    try {
      if (profileFile) {
        const uploadResult = await uploadToStorage(
          profileFile,
          STORAGE_BUCKETS.GENERAL_ASSETS,
          STORAGE_FOLDERS.USER_PROFILES,
        );
        if (!uploadResult.success) {
          return errorResponse(uploadResult.message, 500);
        }
        profileUrl = uploadResult.url;
      }

      const updateData = { ...parsedData.data };
      if (profileUrl) updateData.profileImage = profileUrl;
      // Handle explicit removal of profileImage
      if (fields.profileImage === null) updateData.profileImage = null;
      if (fields.password) updateData.password = fields.password;

      const updatedUser = await updateUser(id, updateData);

      // Cleanup old file if a new file was uploaded, or if it was explicitly removed
      if ((profileUrl && oldProfileUrl) || (fields.profileImage === null && oldProfileUrl)) {
        await deleteFromStorage(oldProfileUrl, STORAGE_BUCKETS.GENERAL_ASSETS);
      }

      logger.apiSuccess("PATCH", `/api/admin/users/${id}`);
      return successResponse(updatedUser);
    } catch (dbError) {
      if (profileUrl) {
         await deleteFromStorage(profileUrl, STORAGE_BUCKETS.GENERAL_ASSETS);
      }
      throw dbError;
    }
  } catch (error) {
    logger.apiError("PATCH", `/api/admin/users/[id]`, error);
    if (error.code === "P2002")
      return conflictResponse("Username atau Email sudah terdaftar.");
    if (error.code === "P2025") return notFoundResponse("Pengguna");
    return serverErrorResponse("Gagal memperbarui pengguna.");
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    logger.apiRequest("DELETE", `/api/admin/users/${id}`);

    const user = await getUserById(id);
    if (!user) return notFoundResponse("User");

    await deleteUser(id);

    // Delete associated profile image if exists
    if (user.profileImage) {
      await deleteFromStorage(user.profileImage, STORAGE_BUCKETS.GENERAL_ASSETS);
    }

    logger.apiSuccess("DELETE", `/api/admin/users/${id}`);
    return successResponse({ deleted: true });
  } catch (error) {
    logger.apiError("DELETE", `/api/admin/users/[id]`, error);
    if (error.code === "P2025") return notFoundResponse("Pengguna");
    return serverErrorResponse("Gagal menghapus pengguna.");
  }
}
