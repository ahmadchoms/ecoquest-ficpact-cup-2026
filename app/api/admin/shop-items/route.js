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
import { adminShopItemSchema, paginationSchema } from "@/lib/validations/admin";
import { parseFormData } from "@/lib/server/utils/formdata";
import {
  STORAGE_BUCKETS,
  getShopItemFolder,
  uploadToStorage,
  deleteFromStorage,
} from "@/lib/storage";
import {
  listShopItems,
  createShopItem,
} from "@/lib/server/services/shopitem.service";

export async function GET(request) {
  const clientId = getClientIdentifier(request);
  const { limited } = checkRateLimit(`shopItems:${clientId}`, {
    maxRequests: 10,
  });
  if (limited)
    return errorResponse("Terlalu banyak permintaan. Coba lagi nanti.", 429);

  try {
    logger.apiRequest("GET", "/api/admin/shop-items");

    const { searchParams } = new URL(request.url);
    const query = {};
    for (const [key, value] of searchParams.entries()) {
      query[key] = value;
    }

    const parsedParams = paginationSchema.safeParse(query);
    if (!parsedParams.success)
      return validationErrorResponse(parsedParams.error);

    const { page, limit, search } = parsedParams.data;
    const result = await listShopItems({
      page,
      limit,
      search,
      type: query.type,
      isActive: query.isActive,
    });

    logger.apiSuccess("GET", "/api/admin/shop-items", {
      total: result.meta.total,
    });
    return successResponse(result.data, result.meta);
  } catch (error) {
    logger.apiError("GET", "/api/admin/shop-items", error);
    return serverErrorResponse("Gagal memuat item toko.");
  }
}

export async function POST(request) {
  const clientId = getClientIdentifier(request);
  const { limited } = checkRateLimit(`shopItems:${clientId}:mutate`, {
    maxRequests: 10,
  });
  if (limited)
    return errorResponse("Terlalu banyak permintaan. Coba lagi nanti.", 429);

  try {
    logger.apiRequest("POST", "/api/admin/shop-items");

    const formData = await request.formData();
    const { fields, files } = parseFormData(formData);

    const parsedData = adminShopItemSchema.omit({ content: true, previewUrl: true }).safeParse(fields);
    if (!parsedData.success) return validationErrorResponse(parsedData.error);

    let contentUrl = null;
    const contentFile = files.content;

    try {
      if (contentFile) {
        const uploadResult = await uploadToStorage(
          contentFile,
          STORAGE_BUCKETS.SHOP_ASSETS,
          getShopItemFolder(parsedData.data.type),
        );
        if (!uploadResult.success) {
          return errorResponse(uploadResult.message, 500);
        }
        contentUrl = uploadResult.url;
      }

      const itemData = { ...parsedData.data };
      if (contentUrl) {
          itemData.content = contentUrl;
      } else if (!fields.content && !contentFile) {
          // Fallback if none provided
          return errorResponse("Content is required", 400);
      }

      const newItem = await createShopItem(itemData);

      logger.apiSuccess("POST", "/api/admin/shop-items", { id: newItem.id });
      return createdResponse(newItem);
    } catch (dbError) {
      if (contentUrl) {
          await deleteFromStorage(contentUrl, STORAGE_BUCKETS.SHOP_ASSETS);
      }
      throw dbError;
    }
  } catch (error) {
    logger.apiError("POST", "/api/admin/shop-items", error);
    return serverErrorResponse("Gagal menambahkan item toko.");
  }
}
