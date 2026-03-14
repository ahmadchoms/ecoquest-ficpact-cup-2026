import {
  checkRateLimit,
  getClientIdentifier,
} from "@/lib/server/utils/rate-limit";
import {
  successResponse,
  createdResponse,
  errorResponse,
  validationErrorResponse,
  serverErrorResponse,
} from "@/lib/server/utils/response";
import { logger } from "@/lib/server/utils/logger";
import { adminEventSchema, paginationSchema } from "@/lib/validations/admin";
import { parseFormData } from "@/lib/server/utils/formdata";
import {
  STORAGE_BUCKETS,
  STORAGE_FOLDERS,
  uploadToStorage,
  deleteFromStorage,
} from "@/lib/storage";
import {
  listEvents,
  createEvent,
} from "@/lib/server/services/event.service";

export async function GET(request) {
  const clientId = getClientIdentifier(request);
  const { limited } = checkRateLimit(`events:${clientId}`, {
    maxRequests: 10,
  });
  if (limited)
    return errorResponse("Terlalu banyak permintaan. Coba lagi nanti.", 429);

  try {
    logger.apiRequest("GET", "/api/admin/events");

    const { searchParams } = new URL(request.url);
    const query = {};
    for (const [key, value] of searchParams.entries()) {
      query[key] = value;
    }

    const parsedParams = paginationSchema.safeParse(query);
    if (!parsedParams.success)
      return validationErrorResponse(parsedParams.error);

    const { page, limit, search } = parsedParams.data;
    const result = await listEvents({
      page,
      limit,
      search,
      isActive: query.isActive,
    });

    logger.apiSuccess("GET", "/api/admin/events", {
      total: result.meta.total,
    });
    return successResponse(result.data, result.meta);
  } catch (error) {
    logger.apiError("GET", "/api/admin/events", error);
    return serverErrorResponse("Gagal memuat event.");
  }
}

export async function POST(request) {
  const clientId = getClientIdentifier(request);
  const { limited } = checkRateLimit(`events:${clientId}:mutate`, {
    maxRequests: 10,
  });
  if (limited)
    return errorResponse("Terlalu banyak permintaan. Coba lagi nanti.", 429);

  try {
    logger.apiRequest("POST", "/api/admin/events");

    const formData = await request.formData();
    const { fields, files } = parseFormData(formData);

    const parsedData = adminEventSchema.safeParse(fields);
    if (!parsedData.success) return validationErrorResponse(parsedData.error);

    let bannerUrl = null;
    let uploadPath = null;
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
        uploadPath = uploadResult.path;
      }

      const eventData = { ...parsedData.data };
      if (bannerUrl) eventData.bannerUrl = bannerUrl;

      const newEvent = await createEvent(eventData);

      logger.apiSuccess("POST", "/api/admin/events", { id: newEvent.id });
      return createdResponse(newEvent);
    } catch (dbError) {
      // Rollback: if database fails but we already uploaded a file, delete the orphaned file
      if (bannerUrl) {
         await deleteFromStorage(bannerUrl, STORAGE_BUCKETS.EVENT_ASSETS);
      }
      throw dbError; // Rethrow to be caught by outer catch block
    }
  } catch (error) {
    logger.apiError("POST", "/api/admin/events", error);
    return serverErrorResponse("Gagal menambahkan event.");
  }
}
