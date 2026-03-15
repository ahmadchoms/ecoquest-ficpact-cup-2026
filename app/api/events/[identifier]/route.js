import { successResponse, errorResponse, serverErrorResponse } from "@/lib/server/utils/response";
import { logger } from "@/lib/server/utils/logger";
import prisma from "@/lib/prisma";
import { enrichShopItemsWithRarity } from "@/lib/server/utils/shop-rarity";

/**
 * Helper function to convert string to slug format
 * "Summer Festival Eksklusif" -> "summer-festival-eksklusif"
 */
function toSlug(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

/**
 * GET /api/events/[identifier]
 * Get event by ID or by name slug + all related shop items
 */
export async function GET(request, { params }) {
  try {
    const { identifier } = await params;
    console.log("🔍 API: Searching for identifier:", identifier);

    let event = null;

    // Coba cari by ID dulu
    try {
      event = await prisma.event.findUnique({
        where: { id: identifier },
      });
      console.log("✅ After findUnique by ID:", event ? "Found" : "Not found");
    } catch (error) {
      console.log("⚠️ ID search failed, trying slug match");
    }

    // Jika tidak ketemu by ID, fetch semua events dan cari by slug matching
    if (!event) {
      try {
        const allEvents = await prisma.event.findMany();
        console.log(`📊 Total events in database: ${allEvents.length}`);
        
        // Cari event yang slug-nya match dengan identifier
        for (const e of allEvents) {
          const eventSlug = toSlug(e.name);
          console.log(`  Comparing: "${eventSlug}" === "${identifier}" ? ${eventSlug === identifier}`);
          if (eventSlug === identifier) {
            console.log("✅ Found matching event by slug:", e.name);
            event = e;
            break;
          }
        }
        
        if (!event) {
          console.log("❌ No matching event found by slug");
        }
      } catch (error) {
        console.error("Error fetching all events:", error);
      }
    }

    if (!event) {
      console.log("❌ Event not found");
      return Response.json(
        { success: false, message: "Event tidak ditemukan" },
        { status: 404 }
      );
    }

    // Fetch items terikat event ini
    let items = [];
    try {
      items = await prisma.shopItem.findMany({
        where: {
          eventId: event.id,
          isActive: true,
        },
        orderBy: { createdAt: "desc" },
      });
      console.log(`✅ Found ${items.length} items for event`);
    } catch (error) {
      console.error("Error fetching items:", error);
    }

    // Enrich items dengan rarity
    const enrichedItems = enrichShopItemsWithRarity(items);

    // Transform data untuk component collection
    const collection = {
      id: event.id,
      collectionId: toSlug(event.name),
      title: event.name,
      subtitle: event.description,
      description: event.description,
      imageUrl: event.bannerUrl || "/images/events/default-banner.jpg",
      items: enrichedItems,
    };

    console.log("✅ API response ready");
    return Response.json({ success: true, data: collection });
  } catch (error) {
    console.error("❌ API Error:", error);
    return Response.json(
      { success: false, message: "Gagal memuat event", error: error.message },
      { status: 500 }
    );
  }
}

