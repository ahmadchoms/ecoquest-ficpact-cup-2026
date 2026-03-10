"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import SpecialShop from "@/components/shop/SpecialShop";
import DailyRefresh from "@/components/shop/DailyRefresh";
import AllItems from "@/components/shop/AllItems";
import { shopBanners, getDailyExclusiveItems, commonItems } from "@/data/shop";
import { staggerContainer, fadeIn } from "@/utils/motion-variants";

export default function ShopPage() {
  const dailyItems = useMemo(() => getDailyExclusiveItems(4), []);

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
          <AllItems items={commonItems} />
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
}
