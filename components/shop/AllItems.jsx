"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import ItemCard from "./ItemCard";

const ITEM_CATEGORIES = [
  { id: "all", label: "Semua" },
  { id: "BANNER", label: "Banner" },
  { id: "BORDER", label: "Border" },
];

export default function AllItems({ items = [] }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredItems = items.filter((item) => {
    if (activeCategory === "all") return true;
    return item.type === activeCategory;
  });

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-black">
        📦 Semua Item
      </h2>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {ITEM_CATEGORIES.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 sm:px-6 py-2 sm:py-3 font-bold text-sm sm:text-base rounded-xl border-3 border-black transition-all ${
              activeCategory === category.id
                ? "bg-emerald-500 text-white shadow-hard"
                : "bg-slate-100 text-black hover:bg-slate-200 shadow-hard hover:shadow-hard-lg"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category.label}
          </motion.button>
        ))}
      </div>

      {/* Items Count */}
      <p className="text-sm font-medium text-slate-600">
        Menampilkan {filteredItems.length} item
      </p>

      {/* Items Grid */}
      <motion.div
        key={`items-${activeCategory}`}
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <motion.div key={item.id} variants={itemVariant}>
              <ItemCard item={item} delay={index * 0.02} />
            </motion.div>
          ))
        ) : (
          <motion.div
            variants={itemVariant}
            className="col-span-full text-center py-12 text-slate-500"
          >
            <p className="font-medium">Tidak ada item di kategori ini</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
