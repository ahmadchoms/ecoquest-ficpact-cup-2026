"use client";

import { motion } from "framer-motion";
import { useMemo, useEffect, useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import SpecialShop from "@/components/shop/SpecialShop";
import DailyRefresh from "@/components/shop/DailyRefresh";
import AllItems from "@/components/shop/AllItems";
import { staggerContainer, fadeIn } from "@/utils/motion-variants";
import { useAvailableShopItems } from "@/hooks/useUserMissions";

export default function ShopPage() {
  const { data: shopItems = [], isLoading } = useAvailableShopItems();
  const [activeEvents, setActiveEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  // Fetch active events untuk banner
  useEffect(() => {
    const fetchActiveEvents = async () => {
      try {
        const response = await fetch("/api/events/active");
        if (response.ok) {
          const data = await response.json();
          setActiveEvents(data.data || []);
        }
      } catch (error) {
        console.error("Error fetching active events:", error);
      } finally {
        setEventsLoading(false);
      }
    };

    fetchActiveEvents();
  }, []);

  // Daily Refresh: Items dengan eventId (limited items)
  const dailyItems = useMemo(() => {
    const itemsWithEvent = shopItems.filter((item) => item.eventId);
    if (itemsWithEvent.length === 0) return [];
    const shuffled = [...itemsWithEvent].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  }, [shopItems]);

  // All Items: Items tanpa eventId (permanent items)
  const permanentItems = useMemo(() => {
    return shopItems.filter((item) => !item.eventId);
  }, [shopItems]);

  return (
    <PageWrapper className="min-h-screen bg-white pt-20 pb-24 font-body">
      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-4 py-6 space-y-16"
      >
        {/* Page Header */}
        <motion.div variants={fadeIn("down", 0.1)} className="text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold mb-2 text-black">
            🛍️ Toko EcoQuest
          </h1>
          <p className="text-slate-600 text-base sm:text-lg font-medium">
            Kumpulkan item eksklusif dan tunjukkan prestasi ekologimu
          </p>
        </motion.div>

        {/* Special Shop Section - dengan Active Events */}
        <motion.div variants={fadeIn("up", 0.15)}>
          {eventsLoading ? (
            <div className="text-center py-8">
              <p className="text-slate-600 font-medium">Memuat event...</p>
            </div>
          ) : activeEvents.length > 0 ? (
            <SpecialShop banners={activeEvents} />
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-600 font-medium">Tidak ada event aktif saat ini</p>
            </div>
          )}
        </motion.div>

        {/* Divider */}
        <motion.div
          variants={fadeIn("up", 0.2)}
          className="h-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent rounded-full"
        />

        {/* Daily Refresh Section */}
        <motion.div variants={fadeIn("up", 0.25)}>
          <DailyRefresh items={dailyItems} />
        </motion.div>

        {/* Divider */}
        <motion.div
          variants={fadeIn("up", 0.3)}
          className="h-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent rounded-full"
        />

        {/* All Items Section - dengan permanent items filter */}
        <motion.div variants={fadeIn("up", 0.35)}>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-slate-600 font-medium">Memuat item...</p>
            </div>
          ) : (
            <AllItems items={permanentItems} />
          )}
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
}
