"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EcoCard from "@/components/design-system/EcoCard";
import Link from "next/link";

export default function SpecialShop({ banners = [] }) {
  // Ensure banners is always an array
  const safeBanners = Array.isArray(banners) ? banners : [];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Debug log
  useEffect(() => {
    console.log("SpecialShop banners:", safeBanners, "length:", safeBanners.length);
  }, [safeBanners]);

  useEffect(() => {
    if (!autoPlay || safeBanners.length === 0) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % safeBanners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay, safeBanners.length]);

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      zIndex: 0,
      x: dir < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentIndex(
      (prev) => (prev + newDirection + safeBanners.length) % safeBanners.length
    );
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 5000);
  };

  if (!safeBanners || safeBanners.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-black">
          🌟 Toko Spesial
        </h2>
        <div className="bg-slate-100 rounded-2xl p-8 text-center text-slate-600">
          <p>Tidak ada banner khusus saat ini</p>
        </div>
      </div>
    );
  }

  const currentBanner = safeBanners[currentIndex] || safeBanners[0];

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-black">
        🌟 Toko Spesial
      </h2>

      {/* Carousel Container */}
      <div
        className="relative w-full overflow-hidden rounded-2xl group"
        onMouseEnter={() => setAutoPlay(false)}
        onMouseLeave={() => setAutoPlay(true)}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="w-full"
          >
            {/* Banner Content */}
            {currentBanner && (
              <div
                className="w-full bg-cover bg-center bg-no-repeat py-6 sm:py-8 px-6 sm:px-8 rounded-2xl border-3 border-black shadow-hard relative overflow-hidden"
                style={{
                  backgroundImage: currentBanner.bannerUrl 
                    ? `url('${currentBanner.bannerUrl}')` 
                    : 'none',
                  backgroundColor: !currentBanner.bannerUrl ? '#f0f0f0' : 'transparent',
                }}
              >
                {/* Overlay untuk text readability */}
                <div className="absolute inset-0 bg-black/30" />

                <div className="relative z-10 max-w-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-extrabold rounded-lg shadow-hard border-2 border-black bg-purple-400 text-black`}
                    >
                      {currentBanner.badgeText || "EVENT"}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl sm:text-4xl font-extrabold text-white mb-1">
                    {currentBanner.title || currentBanner.name}
                  </h3>

                  <p className="text-sm sm:text-lg font-bold text-white/90 mb-4">
                    {currentBanner.subtitle || currentBanner.description}
                  </p>

                  <p className="text-sm sm:text-base text-white/90 mb-6">
                    {currentBanner.description}
                  </p>

                  {currentBanner.name && (
                    <Link href={`/shop/collection/${currentBanner.name.toLowerCase().replace(/\s+/g, '-')}`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 sm:px-8 py-2 sm:py-3 bg-black text-yellow-400 font-display font-extrabold rounded-xl shadow-hard hover:shadow-hard-lg border-3 border-black transition-all"
                      >
                        Lihat Koleksi
                      </motion.button>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => paginate(-1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 bg-white rounded-full shadow-hard border-3 border-black hover:bg-slate-50 transition-colors opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft size={20} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => paginate(1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 bg-white rounded-full shadow-hard border-3 border-black hover:bg-slate-50 transition-colors opacity-0 group-hover:opacity-100"
        >
          <ChevronRight size={20} />
        </motion.button>
      </div>

      {/* Indicator Dots */}
      <div className="flex items-center justify-center gap-2">
        {safeBanners && safeBanners.length > 0 && safeBanners.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
              setAutoPlay(false);
              setTimeout(() => setAutoPlay(true), 5000);
            }}
            className={`h-2 rounded-full transition-all border-2 border-black ${
              index === currentIndex
                ? "bg-black w-8"
                : "bg-slate-300 w-2 hover:bg-slate-400"
            }`}
            whileHover={{ scale: 1.2 }}
          />
        ))}
      </div>
    </div>
  );
}
