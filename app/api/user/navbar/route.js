import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/server/utils/response";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return errorResponse("Unauthorized", 401);
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        xp: true, // Mengambil field xp
        points: true, // Mengambil field points
        level: true,
        profileImage: true,
      },
    });

    if (!user) return errorResponse("User not found", 404);

    return successResponse(user);
  } catch (error) {
    return errorResponse("Failed to fetch navbar data", 500);
  }
}