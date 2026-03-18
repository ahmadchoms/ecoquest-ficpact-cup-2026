"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import ItemCard from "./ItemCard";
import { userShopKeys } from "@/hooks/useUserMissions";

export default function DailyRefresh({ items = [], ownedItemIds = new Set() }) {
  const queryClient = useQueryClient();
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [hasRefreshed, setHasRefreshed] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const diff = tomorrow - now;
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ hours, minutes, seconds });

      // Trigger invalidation ketika timer mencapai 0 (ganti hari)
      if (diff <= 0 && !hasRefreshed) {
        // Invalidate shop items query agar refetch data baru
        queryClient.invalidateQueries({ queryKey: userShopKeys.shopItems() });
        setHasRefreshed(true);
      } else if (diff > 1000 && hasRefreshed) {
        // Reset flag ketika masuk hari baru (untuk hari esok harinya)
        setHasRefreshed(false);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [queryClient, hasRefreshed]);

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-black">
          🔄 Refresh Harian
        </h2>

        {/* Countdown Timer */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 border-2 border-black rounded-xl font-bold text-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <span className="text-black">Refresh dalam:</span>
          <span className="font-display font-extrabold text-emerald-700">
            {String(timeLeft.hours).padStart(2, "0")}:
            {String(timeLeft.minutes).padStart(2, "0")}:
            {String(timeLeft.seconds).padStart(2, "0")}
          </span>
        </motion.div>
      </div>

      <p className="text-slate-600 text-sm font-medium">
        4 item eksklusif acak yang berubah setiap hari. Jangan lewatkan kesempatan
        emas untuk mendapatkan item langka!
      </p>

      {/* Items Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {items.map((item, index) => (
          <ItemCard 
            key={item.id} 
            item={item} 
            delay={index * 0.05}
            isOwned={ownedItemIds.has(item.id)}
          />
        ))}
      </motion.div>
    </div>
  );
}
