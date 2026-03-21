import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  unauthorizedResponse,
  serverErrorResponse,
} from "@/lib/server/utils/response";
import { logger } from "@/lib/server/utils/logger";
import {
  checkRateLimit,
  getClientIdentifier,
} from "@/lib/server/utils/rate-limit";
import { checkUsernameAvailability } from "@/lib/server/services/user.service";
import { z } from "zod";

/**
 * POST /api/user/check-username
 * Check if username is available (unique)
 * Returns { available: boolean }
 */
export async function POST(request) {
  const clientId = getClientIdentifier(request);
  const { limited } = checkRateLimit(`check-username:${clientId}`, {
    maxRequests: 50,
  });
  if (limited)
    return errorResponse("Terlalu banyak permintaan. Coba lagi nanti.", 429);

  try {
    logger.apiRequest("POST", "/api/user/check-username");

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      logger.apiError("POST", "/api/user/check-username", "Unauthorized");
      return unauthorizedResponse("Silakan login terlebih dahulu");
    }

    const body = await request.json();

    // Validate input
    const schema = z.object({
      username: z
        .string()
        .min(3, "Username minimal 3 karakter")
        .max(30, "Username maksimal 30 karakter")
        .regex(
          /^[a-zA-Z0-9_-]+$/,
          "Username hanya boleh mengandung huruf, angka, underscore, dan dash"
        ),
    });

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { username } = parsed.data;

    // Check username availability using service
    const result = await checkUsernameAvailability(username, session.user.email);

    logger.apiSuccess("POST", "/api/user/check-username", {
      username,
      available: result.available,
    });

    return successResponse({
      username: result.username,
      available: result.available,
    });
  } catch (error) {
    logger.apiError("POST", "/api/user/check-username", error);
    return serverErrorResponse("Gagal mengecek ketersediaan username");
  }
}
