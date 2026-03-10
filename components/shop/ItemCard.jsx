"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import EcoCard from "@/components/design-system/EcoCard";
import EcoButton from "@/components/design-system/EcoButton";
import PurchaseConfirmation from "./PurchaseConfirmation";
import Toast from "@/components/ui/Toast";

export default function ItemCard({ item, delay = 0, onBuyClick = null }) {
  // Safety check
  if (!item) return null;
  
  const { coins, deductCoins } = useUserStore();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const rarityColors = {
    common: "from-slate-300 to-slate-400",
    uncommon: "from-green-300 to-emerald-400",
    rare: "from-blue-300 to-cyan-400",
    epic: "from-purple-300 to-indigo-400",
    legendary: "from-yellow-300 to-orange-400",
  };

  const rarityBgColor = {
    common: "bg-slate-100",
    uncommon: "bg-green-100",
    rare: "bg-blue-100",
    epic: "bg-purple-100",
    legendary: "bg-yellow-100",
  };

  const rarityTextColor = {
    common: "text-slate-700",
    uncommon: "text-green-700",
    rare: "text-blue-700",
    epic: "text-purple-700",
    legendary: "text-yellow-700",
  };

  const rarityBorderColor = {
    common: "border-slate-300",
    uncommon: "border-green-300",
    rare: "border-blue-300",
    epic: "border-purple-300",
    legendary: "border-yellow-300",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="h-full"
    >
      <EcoCard
        variant="feature"
        className="h-full flex flex-col overflow-hidden hover:shadow-hard-lg group"
      >
        {/* Item Image Container */}
        <div
          className={`h-40 sm:h-48 bg-gradient-to-br ${rarityColors[item.rarity]} rounded-2xl flex items-center justify-center text-5xl sm:text-6xl overflow-hidden relative`}
        >
          <motion.div
            whileHover={{ scale: 1.15 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative z-10"
          >
            {item.image}
          </motion.div>
          {/* Background glow effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-white transition-opacity duration-300" />
        </div>

        {/* Item Info */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Type Badge */}
          <div className="mb-2">
            <span
              className={`inline-block px-3 py-1 text-xs font-bold rounded-lg ${
                item.type === "exclusive"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {item.type === "exclusive" ? "EKSKLUSIF" : "UMUM"}
            </span>
          </div>

          {/* Item Name */}
          <h3 className="font-display font-bold text-sm sm:text-base mb-1 line-clamp-2">
            {item.name}
          </h3>

          {/* Rarity Badge */}
          <div className="mb-3">
            <span
              className={`text-xs font-bold px-2 py-1 rounded-lg ${rarityBgColor[item.rarity]} ${rarityTextColor[item.rarity]}`}
            >
              {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 mb-auto line-clamp-2">
            {item.description}
          </p>

          {/* Price and Button */}
          <div className="mt-4 space-y-2">
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-xl font-display font-extrabold">
                {item.price}
              </span>
              <span className="text-xs font-bold text-slate-500">Poin</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (coins < item.price) {
                  setToastMessage(`Poin tidak cukup! Kamu membutuhkan ${item.price - coins} poin lagi.`);
                  setShowToast(true);
                  setTimeout(() => setShowToast(false), 3000);
                  return;
                }
                if (onBuyClick) {
                  onBuyClick();
                } else {
                  setShowConfirmation(true);
                }
              }}
              disabled={isProcessing}
              className={`w-full px-4 py-2.5 font-bold text-sm rounded-xl shadow-md transition-all ${
                coins >= item.price
                  ? "bg-emerald-500 text-white hover:shadow-lg hover:bg-emerald-600"
                  : "bg-slate-300 text-slate-500 cursor-not-allowed"
              }`}
            >
              {coins >= item.price ? "Beli Sekarang" : "Poin Kurang"}
            </motion.button>
          </div>
        </div>
      </EcoCard>

      {/* Purchase Confirmation Modal */}
      {showConfirmation && !onBuyClick && (
        <PurchaseConfirmation
          isOpen={showConfirmation}
          item={item}
          onConfirm={async () => {
            setIsProcessing(true);
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 800));
            deductCoins(item.price);
            setIsProcessing(false);
            setShowConfirmation(false);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
          }}
          onCancel={() => setShowConfirmation(false)}
          isLoading={isProcessing}
        />
      )}

      {/* Toast Notification */}
      {showToast && (
        <Toast
          isOpen={showToast}
          message={toastMessage || `${item.name} berhasil dibeli!`}
          type={toastMessage?.includes("kurang") ? "error" : "success"}
          onClose={() => setShowToast(false)}
        />
      )}
    </motion.div>
  );
}
