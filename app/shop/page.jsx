"use client";

import { motion } from "framer-motion";
import { useMemo, useEffect, useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import SpecialShop from "@/components/shop/SpecialShop";
import DailyRefresh from "@/components/shop/DailyRefresh";
import AllItems from "@/components/shop/AllItems";
import { staggerContainer, fadeIn } from "@/utils/motion-variants";
import { useAvailableShopItems } from "@/hooks/useUserMissions";
import { useActiveEvents } from "@/hooks/useEvents";

export default function ShopPage() {
  const { data: shopItems = [], isLoading: shopLoading } =
    useAvailableShopItems();
  const { data: activeEvents = [], isLoading: eventsLoading } =
    useActiveEvents();

  const dailyItems = useMemo(() => {
    const itemsWithEvent = shopItems.filter((item) => item.eventId);
    if (itemsWithEvent.length === 0) return [];
    const shuffled = [...itemsWithEvent].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  }, [shopItems]);

  const permanentItems = useMemo(() => {
    return shopItems.filter((item) => !item.eventId);
  }, [shopItems]);

  return (
    <PageWrapper className="min-h-screen bg-white bg-grid-pattern pt-24 pb-24 text-black">
      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-4 py-6 space-y-16"
      >
        <motion.div
          variants={fadeIn("down", 0.1)}
          className="text-center bg-yellow border-3 border-black shadow-hard p-10 rounded-4xl mx-2 relative overflow-hidden"
        >
          <h1 className="font-display text-5xl md:text-6xl font-black mb-4 uppercase tracking-tight text-black relative z-10">
            🛍️ Toko EcoQuest
          </h1>
          <p className="text-black font-display font-bold text-lg md:text-xl uppercase relative z-10">
            Kumpulkan item eksklusif dan tunjukkan prestasi ekologimu
          </p>
        </motion.div>

        <motion.div variants={fadeIn("up", 0.15)}>
          {eventsLoading ? (
            <div className="bg-white border-3 border-black shadow-hard rounded-4xl text-center py-12 animate-pulse">
              <p className="font-display font-bold text-2xl uppercase text-black">
                Memuat event...
              </p>
            </div>
          ) : activeEvents.length > 0 ? (
            <SpecialShop banners={activeEvents} />
          ) : (
            <div className="bg-pink border-3 border-black shadow-hard rounded-4xl text-center py-12">
              <p className="font-display font-black text-2xl uppercase text-black">
                Tidak ada event aktif saat ini
              </p>
            </div>
          )}
        </motion.div>

        <motion.div
          variants={fadeIn("up", 0.2)}
          className="h-1 w-full bg-black rounded-full"
        />

        <motion.div variants={fadeIn("up", 0.25)}>
          <DailyRefresh items={dailyItems} />
        </motion.div>

        <motion.div
          variants={fadeIn("up", 0.3)}
          className="h-1 w-full bg-black rounded-full"
        />

        <motion.div variants={fadeIn("up", 0.35)}>
          {shopLoading ? (
            <div className="bg-white border-3 border-black shadow-hard rounded-4xl text-center py-12 animate-pulse">
              <p className="font-display font-bold text-2xl uppercase text-black">
                Memuat item...
              </p>
            </div>
          ) : (
            <AllItems items={permanentItems} />
          )}
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
}
