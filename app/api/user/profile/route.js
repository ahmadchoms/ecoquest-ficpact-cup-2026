import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  unauthorizedResponse,
  notFoundResponse,
  serverErrorResponse,
} from "@/lib/server/utils/response";
import { logger } from "@/lib/server/utils/logger";
import {
  checkRateLimit,
  getClientIdentifier,
} from "@/lib/server/utils/rate-limit";
import { getUserProfile, updateUserProfile } from "@/lib/server/services/user.service";
import { userProfileSchema } from "@/lib/validations/user";
import { parseFormData } from "@/lib/server/utils/formdata";
import {
  STORAGE_BUCKETS,
  STORAGE_FOLDERS,
  uploadToStorage,
  deleteFromStorage,
} from "@/lib/storage";

/**
 * GET /api/user/profile
 * Fetch authenticated user's profile data
 */
export async function GET(request) {
  const clientId = getClientIdentifier(request);
  const { limited } = checkRateLimit(`profile:${clientId}`, {
    maxRequests: 30,
  });
  if (limited)
    return errorResponse("Terlalu banyak permintaan. Coba lagi nanti.", 429);

  try {
    logger.apiRequest("GET", "/api/user/profile");

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      logger.apiError("GET", "/api/user/profile", "Unauthorized");
      return unauthorizedResponse("Silakan login terlebih dahulu");
    }

    const profile = await getUserProfile(session.user.email);
    if (!profile) {
      return notFoundResponse("Profil pengguna");
    }

    logger.apiSuccess("GET", "/api/user/profile");
    return successResponse(profile);
  } catch (error) {
    logger.apiError("GET", "/api/user/profile", error);
    return serverErrorResponse("Gagal memuat profil pengguna");
  }
}

/**
 * PATCH /api/user/profile
 * Update authenticated user's profile (name, bio, profileImage via file upload)
 */
export async function PATCH(request) {
  const clientId = getClientIdentifier(request);
  const { limited } = checkRateLimit(`profile:${clientId}`, {
    maxRequests: 10,
  });
  if (limited)
    return errorResponse("Terlalu banyak permintaan. Coba lagi nanti.", 429);

  try {
    logger.apiRequest("PATCH", "/api/user/profile");

    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      logger.apiError("PATCH", "/api/user/profile", "Unauthorized");
      return unauthorizedResponse("Silakan login terlebih dahulu");
    }

    // Get current profile for cleanup later
    const currentProfile = await getUserProfile(session.user.email);
    if (!currentProfile) {
      return notFoundResponse("Profil pengguna");
    }

    // Parse FormData with proper file/field separation
    const formData = await request.formData();
    const { fields, files } = parseFormData(formData);

    // Validate fields using schema
    const parsedData = userProfileSchema.partial().safeParse(fields);
    if (!parsedData.success) {
      return validationErrorResponse(parsedData.error);
    }

    // Handle profile image upload and update
    let profileImageUrl = null;
    const profileImageFile = files.profileImage;

    try {
      if (profileImageFile && profileImageFile instanceof File) {
        // Validate file
        if (profileImageFile.size > 5 * 1024 * 1024) {
          return errorResponse("Ukuran file melebihi batas 5MB.", 400);
        }

        const uploadResult = await uploadToStorage(
          profileImageFile,
          STORAGE_BUCKETS.GENERAL_ASSETS,
          STORAGE_FOLDERS.USER_PROFILES
        );

        if (!uploadResult.success) {
          logger.apiError("PATCH", "/api/user/profile", uploadResult.message);
          return errorResponse(uploadResult.message, 500);
        }

        profileImageUrl = uploadResult.url;
        logger.info("Profile", "Image uploaded successfully", {
          url: profileImageUrl,
        });
      }

      // Build update data
      const updateData = { ...parsedData.data };
      if (profileImageUrl) {
        updateData.profileImage = profileImageUrl;
      }

      // Handle explicit removal of profile image (when profileImage: null is sent)
      if (fields.profileImage === null) {
        updateData.profileImage = null;
      }

      // Update profile in database
      const updatedProfile = await updateUserProfile(
        session.user.email,
        updateData
      );

      // Cleanup old profile image if a new one was uploaded
      if (profileImageUrl && currentProfile.profileImage) {
        await deleteFromStorage(
          currentProfile.profileImage,
          STORAGE_BUCKETS.GENERAL_ASSETS
        );
      }

      // Cleanup old image if it was explicitly removed/cleared
      if (fields.profileImage === null && currentProfile.profileImage) {
        await deleteFromStorage(
          currentProfile.profileImage,
          STORAGE_BUCKETS.GENERAL_ASSETS
        );
      }

      logger.apiSuccess("PATCH", "/api/user/profile");
      return successResponse(updatedProfile);
    } catch (dbError) {
      // Cleanup uploaded file if database operation fails
      if (profileImageUrl) {
        await deleteFromStorage(
          profileImageUrl,
          STORAGE_BUCKETS.GENERAL_ASSETS
        );
      }
      throw dbError;
    }
  } catch (error) {
    logger.apiError("PATCH", "/api/user/profile", error);
    return serverErrorResponse("Gagal memperbarui profil pengguna");
  }
}
