"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import SpecialShop from "@/components/shop/SpecialShop";
import DailyRefresh from "@/components/shop/DailyRefresh";
import AllItems from "@/components/shop/AllItems";
import { shopBanners } from "@/data/shop";
import { staggerContainer, fadeIn } from "@/utils/motion-variants";
import { useAvailableShopItems } from "@/hooks/useUserMissions";

export default function ShopPage() {
  const { data: shopItems = [], isLoading } = useAvailableShopItems();
  
  // Shuffle items for daily refresh
  const dailyItems = useMemo(() => {
    if (shopItems.length === 0) return [];
    const shuffled = [...shopItems].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
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

        {/* Special Shop Section */}
        <motion.div variants={fadeIn("up", 0.15)}>
          <SpecialShop banners={shopBanners} />
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

        {/* All Items Section */}
        <motion.div variants={fadeIn("up", 0.35)}>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-slate-600 font-medium">Memuat item...</p>
            </div>
          ) : (
            <AllItems items={shopItems} />
          )}
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
}
