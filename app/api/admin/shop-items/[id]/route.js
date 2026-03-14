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
import { adminShopItemSchema } from "@/lib/validations/admin";
import { parseFormData } from "@/lib/server/utils/formdata";
import {
  STORAGE_BUCKETS,
  getShopItemFolder,
  uploadToStorage,
  deleteFromStorage,
} from "@/lib/storage";
import {
  getShopItemById,
  updateShopItem,
  deleteShopItem,
} from "@/lib/server/services/shopitem.service";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    logger.apiRequest("GET", `/api/admin/shop-items/${id}`);

    const item = await getShopItemById(id);
    if (!item) return notFoundResponse("Shop Item");

    logger.apiSuccess("GET", `/api/admin/shop-items/${id}`);
    return successResponse(item);
  } catch (error) {
    logger.apiError("GET", `/api/admin/shop-items/[id]`, error);
    return serverErrorResponse("Gagal memuat item toko.");
  }
}

export async function PATCH(request, { params }) {
  const clientId = getClientIdentifier(request);
  const { limited } = checkRateLimit(`shopItems:${clientId}:mutate`, {
    maxRequests: 10,
  });
  if (limited)
    return errorResponse("Terlalu banyak permintaan. Coba lagi nanti.", 429);

  try {
    const { id } = await params;
    logger.apiRequest("PATCH", `/api/admin/shop-items/${id}`);

    const item = await getShopItemById(id);
    if (!item) return notFoundResponse("Shop Item");

    const formData = await request.formData();
    const { fields, files } = parseFormData(formData);

    const parsedData = adminShopItemSchema.omit({ content: true, previewUrl: true }).partial().safeParse(fields);
    if (!parsedData.success) return validationErrorResponse(parsedData.error);

    let contentUrl = null;
    let oldContentUrl = item.content?.startsWith("http") ? item.content : null;
    const contentFile = files.content;

    try {
      if (contentFile) {
        // Use the new type if provided, otherwise fallback to existing item type
        const itemType = parsedData.data.type || item.type;
        const uploadResult = await uploadToStorage(
          contentFile,
          STORAGE_BUCKETS.SHOP_ASSETS,
          getShopItemFolder(itemType),
        );
        if (!uploadResult.success) {
          return errorResponse(uploadResult.message, 500);
        }
        contentUrl = uploadResult.url;
      }

      const updateData = { ...parsedData.data };
      if (contentUrl) {
        updateData.content = contentUrl;
      } else if (fields.content) {
        // It was submitted as text (e.g. they cleared it or it's a raw class string incorrectly)
        updateData.content = fields.content;
      }

      const updatedItem = await updateShopItem(id, updateData);

      // Cleanup old file if a new file was uploaded, or if the field was changed to text
      if (
        oldContentUrl &&
        (contentUrl || (fields.content && fields.content !== oldContentUrl))
      ) {
        await deleteFromStorage(oldContentUrl, STORAGE_BUCKETS.SHOP_ASSETS);
      }

      logger.apiSuccess("PATCH", `/api/admin/shop-items/${id}`);
      return successResponse(updatedItem);
    } catch (dbError) {
      if (contentUrl) {
        await deleteFromStorage(contentUrl, STORAGE_BUCKETS.SHOP_ASSETS);
      }
      throw dbError;
    }
  } catch (error) {
    logger.apiError("PATCH", `/api/admin/shop-items/[id]`, error);
    if (error.code === "P2025") return notFoundResponse("Shop Item");
    return serverErrorResponse("Gagal memperbarui item toko.");
  }
}

export async function DELETE(request, { params }) {
  const clientId = getClientIdentifier(request);
  const { limited } = checkRateLimit(`shopItems:${clientId}:mutate`, {
    maxRequests: 10,
  });
  if (limited)
    return errorResponse("Terlalu banyak permintaan. Coba lagi nanti.", 429);

  try {
    const { id } = await params;
    logger.apiRequest("DELETE", `/api/admin/shop-items/${id}`);

    const item = await getShopItemById(id);
    if (!item) return notFoundResponse("Shop Item");

    await deleteShopItem(id);

    // Delete associated content file if exists and is a URL
    if (item.content && item.content.startsWith("http")) {
      await deleteFromStorage(item.content, STORAGE_BUCKETS.SHOP_ASSETS);
    }

    logger.apiSuccess("DELETE", `/api/admin/shop-items/${id}`);
    return successResponse({ deleted: true });
  } catch (error) {
    logger.apiError("DELETE", `/api/admin/shop-items/[id]`, error);
    if (error.code === "P2025") return notFoundResponse("Shop Item");
    return serverErrorResponse("Gagal menghapus item toko.");
  }
}
