import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  successResponse,
  errorResponse,
} from "@/lib/server/utils/response";
import { getUserDashboardData } from "@/lib/server/services/user.service";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return errorResponse("Tidak terautentikasi", 401);
    }

    const dashboardData = await getUserDashboardData(session.user.email);

    if (!dashboardData) {
      return errorResponse("User tidak ditemukan", 404);
    }

    return successResponse(dashboardData, null, 200);
  } catch (error) {
    console.error("[DASHBOARD_ERROR]", error);
    return errorResponse("Terjadi kesalahan internal server", 500);
  }
}
