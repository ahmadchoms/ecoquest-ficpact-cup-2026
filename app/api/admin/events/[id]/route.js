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
import { adminEventBaseSchema, paginationSchema } from "@/lib/validations/admin";
import { parseFormData } from "@/lib/server/utils/formdata";
import {
  STORAGE_BUCKETS,
  STORAGE_FOLDERS,
  uploadToStorage,
  deleteFromStorage,
} from "@/lib/storage";
import {
  getEventById,
  updateEvent,
  deleteEvent,
} from "@/lib/server/services/event.service";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    logger.apiRequest("GET", `/api/admin/events/${id}`);

    const event = await getEventById(id);
    if (!event) return notFoundResponse("Event");

    logger.apiSuccess("GET", `/api/admin/events/${id}`);
    return successResponse(event);
  } catch (error) {
    logger.apiError("GET", `/api/admin/events/[id]`, error);
    return serverErrorResponse("Gagal memuat event.");
  }
}

export async function PATCH(request, { params }) {
  const clientId = getClientIdentifier(request);
  const { limited } = checkRateLimit(`events:${clientId}:mutate`, {
    maxRequests: 10,
  });
  if (limited)
    return errorResponse("Terlalu banyak permintaan. Coba lagi nanti.", 429);

  try {
    const { id } = await params;
    logger.apiRequest("PATCH", `/api/admin/events/${id}`);

    const event = await getEventById(id);
    if (!event) return notFoundResponse("Event");

    const formData = await request.formData();
    const { fields, files } = parseFormData(formData);

    const parsedData = adminEventBaseSchema.partial().safeParse(fields);
    if (!parsedData.success) return validationErrorResponse(parsedData.error);

    // Manual date refinement if both are sent in the PATCH
    if (parsedData.data.startDate && parsedData.data.endDate) {
      if (parsedData.data.endDate < parsedData.data.startDate) {
        return validationErrorResponse({
          issues: [
            { path: ["endDate"], message: "Tanggal selesai harus setelah tanggal mulai" },
          ],
        });
      }
    }

    let bannerUrl = null;
    let oldBannerUrl = event.bannerUrl;
    const bannerFile = files.bannerUrl;

    try {
      if (bannerFile) {
        const uploadResult = await uploadToStorage(
          bannerFile,
          STORAGE_BUCKETS.EVENT_ASSETS,
          STORAGE_FOLDERS.EVENT_BANNERS,
        );
        if (!uploadResult.success) {
          return errorResponse(uploadResult.message, 500);
        }
        bannerUrl = uploadResult.url;
      }

      const updateData = { ...parsedData.data };
      if (bannerUrl) updateData.bannerUrl = bannerUrl;
      // Handle explicit removal of bannerUrl
      if (fields.bannerUrl === null) updateData.bannerUrl = null;

      const updatedEvent = await updateEvent(id, updateData);

      // Cleanup old file if a new one was uploaded, or if it was explicitly removed
      if (
        (bannerUrl && oldBannerUrl) ||
        (fields.bannerUrl === null && oldBannerUrl)
      ) {
        await deleteFromStorage(oldBannerUrl, STORAGE_BUCKETS.EVENT_ASSETS);
      }

      logger.apiSuccess("PATCH", `/api/admin/events/${id}`);
      return successResponse(updatedEvent);
    } catch (dbError) {
      if (bannerUrl) {
        await deleteFromStorage(bannerUrl, STORAGE_BUCKETS.EVENT_ASSETS);
      }
      throw dbError;
    }
  } catch (error) {
    logger.apiError("PATCH", `/api/admin/events/[id]`, error);
    if (error.code === "P2025") return notFoundResponse("Event");
    return serverErrorResponse("Gagal memperbarui event.");
  }
}

export async function DELETE(request, { params }) {
  const clientId = getClientIdentifier(request);
  const { limited } = checkRateLimit(`events:${clientId}:mutate`, {
    maxRequests: 10,
  });
  if (limited)
    return errorResponse("Terlalu banyak permintaan. Coba lagi nanti.", 429);

  try {
    const { id } = await params;
    logger.apiRequest("DELETE", `/api/admin/events/${id}`);

    const event = await getEventById(id);
    if (!event) return notFoundResponse("Event");

    await deleteEvent(id);

    // Delete associated banner if exists
    if (event.bannerUrl) {
      await deleteFromStorage(event.bannerUrl, STORAGE_BUCKETS.EVENT_ASSETS);
    }

    logger.apiSuccess("DELETE", `/api/admin/events/${id}`);
    return successResponse({ deleted: true });
  } catch (error) {
    logger.apiError("DELETE", `/api/admin/events/[id]`, error);
    if (error.code === "P2025") return notFoundResponse("Event");
    return serverErrorResponse("Gagal menghapus event.");
  }
}
