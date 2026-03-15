import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  successResponse,
  errorResponse,
} from "@/lib/server/utils/response";
import { getUserBadges } from "@/lib/server/services/user.service";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return errorResponse("Tidak terautentikasi", 401);
    }

    const badges = await getUserBadges(session.user.email);

    if (!badges) {
      return errorResponse("User tidak ditemukan", 404);
    }

    return successResponse(badges, null, 200);
  } catch (error) {
    console.error("[BADGES_ERROR]", error);
    return errorResponse("Terjadi kesalahan internal server", 500);
  }
}
