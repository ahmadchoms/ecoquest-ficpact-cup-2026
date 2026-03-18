"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import { usePurchaseShopItem } from "@/hooks/useUserMissions";
import { useNavbarData } from "@/hooks/useNavbarData";
import EcoCard from "@/components/design-system/EcoCard";
import EcoButton from "@/components/design-system/EcoButton";
import PurchaseConfirmation from "./PurchaseConfirmation";
import Toast from "@/components/ui/Toast";

export default function ItemCard({ item, delay = 0, onBuyClick = null, isOwned = false }) {
  // Safety check
  if (!item) return null;
  
  const { points: userPoints, deductCoins } = useUserStore();
  const { data: navbarData } = useNavbarData(); // Fetch fresh points from database
  const purchaseMutation = usePurchaseShopItem();
  
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [realTimePoints, setRealTimePoints] = useState(userPoints); // State untuk database points
  const [localIsOwned, setLocalIsOwned] = useState(isOwned); // Track ownership state

  // Update realTimePoints ketika navbarData berubah
  useEffect(() => {
    if (navbarData?.points !== undefined) {
      setRealTimePoints(navbarData.points);
    }
  }, [navbarData?.points]);
  
  // Update localIsOwned ketika isOwned prop berubah
  useEffect(() => {
    setLocalIsOwned(isOwned);
  }, [isOwned]);
  
  const rarityColors = {
    common: "from-slate-300 to-slate-400",
    exclusive: "from-purple-300 to-indigo-400",
    uncommon: "from-green-300 to-emerald-400",
    rare: "from-blue-300 to-cyan-400",
    epic: "from-purple-300 to-indigo-400",
    legendary: "from-yellow-300 to-orange-400",
  };

  const rarityBgColor = {
    common: "bg-slate-100",
    exclusive: "bg-purple-100",
    uncommon: "bg-green-100",
    rare: "bg-blue-100",
    epic: "bg-purple-100",
    legendary: "bg-yellow-100",
  };

  const rarityTextColor = {
    common: "text-slate-700",
    exclusive: "text-purple-700",
    uncommon: "text-green-700",
    rare: "text-blue-700",
    epic: "text-purple-700",
    legendary: "text-yellow-700",
  };

  const handlePurchaseClick = () => {
    if (localIsOwned) {
      return; // Don't do anything if already owned
    }
    
    if (realTimePoints < item.price) {
      setToastMessage(`Poin tidak cukup! Kamu membutuhkan ${item.price - realTimePoints} poin lagi.`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    if (onBuyClick) {
      onBuyClick();
    } else {
      setShowConfirmation(true);
    }
  };

  const handleConfirmPurchase = async () => {
    try {
      await purchaseMutation.mutateAsync(item.id);
      // Update localIsOwned to true since purchase succeeded
      setLocalIsOwned(true);
      // Update realTimePoints dengan hasil dari response
      const newPoints = realTimePoints - item.price;
      setRealTimePoints(newPoints);
      deductCoins(item.price);
      setShowConfirmation(false);
      setToastMessage(`${item.name} berhasil dibeli!`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (error) {
      setToastMessage(error.response?.data?.message || "Gagal membeli item. Silakan coba lagi.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
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
          className={`h-40 sm:h-48 bg-linear-to-br ${rarityColors[item.rarity] || rarityColors.common} rounded-2xl flex items-center justify-center text-5xl sm:text-6xl overflow-hidden relative`}
        >
          <motion.div
            whileHover={{ scale: 1.15 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative z-10"
          >
            {item.previewUrl ? (
              <img src={item.previewUrl} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              "📦"
            )}
          </motion.div>
          {/* Background glow effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-white transition-opacity duration-300" />
        </div>

        {/* Item Info */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Type & Rarity Badges */}
          <div className="mb-2 flex flex-wrap gap-2">
            <span
              className={`inline-block px-3 py-1 text-xs font-bold rounded-lg ${
                item.type === "BANNER"
                  ? "bg-blue-100 text-blue-700"
                  : item.type === "BORDER"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {item.type === "BANNER" ? "BANNER PROFIL" : item.type === "BORDER" ? "BORDER PROFIL" : "ITEM"}
            </span>
            
            {/* Rarity Badge - menunjukkan exclusive atau common */}
            <span
              className={`inline-block px-3 py-1 text-xs font-bold rounded-lg ${
                item.rarity === "exclusive"
                  ? "bg-amber-100 text-amber-700 border border-amber-300"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {item.rarity === "exclusive" ? "⏰ LIMITED" : "✓ PERMANENT"}
            </span>
          </div>

          {/* Item Name */}
          <h3 className="font-display font-bold text-sm sm:text-base mb-1 line-clamp-2">
            {item.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-600 mb-auto line-clamp-2">
            {item.description || "Item eksklusif dari EcoQuest"}
          </p>

          {/* Price and Button */}
          <div className="mt-4 space-y-2">
            {!localIsOwned && (
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-display font-extrabold">
                  {item.price}
                </span>
                <span className="text-xs font-bold text-slate-500">Poin</span>
              </div>
            )}

            <motion.button
              whileHover={localIsOwned ? {} : { scale: 1.02 }}
              whileTap={localIsOwned ? {} : { scale: 0.98 }}
              onClick={handlePurchaseClick}
              disabled={purchaseMutation.isPending || localIsOwned || realTimePoints < item.price}
              className={`w-full px-4 py-2.5 font-bold text-sm rounded-xl shadow-md transition-all ${
                localIsOwned
                  ? "bg-slate-200 text-slate-500 cursor-not-allowed border-2 border-slate-300"
                  : realTimePoints >= item.price && !purchaseMutation.isPending
                  ? "bg-emerald-500 text-white hover:shadow-lg hover:bg-emerald-600"
                  : "bg-slate-300 text-slate-500 cursor-not-allowed"
              }`}
            >
              {localIsOwned 
                ? "✓ Sudah Dimiliki" 
                : purchaseMutation.isPending 
                ? "Membeli..." 
                : realTimePoints >= item.price 
                ? "Beli Sekarang" 
                : "Poin Kurang"
              }
            </motion.button>
          </div>
        </div>
      </EcoCard>

      {/* Purchase Confirmation Modal */}
      {showConfirmation && !onBuyClick && (
        <PurchaseConfirmation
          isOpen={showConfirmation}
          item={item}
          onConfirm={handleConfirmPurchase}
          onCancel={() => setShowConfirmation(false)}
          isLoading={purchaseMutation.isPending}
        />
      )}

      {/* Toast Notification */}
      {showToast && (
        <Toast
          isOpen={showToast}
          message={toastMessage || `${item.name} berhasil dibeli!`}
          type={toastMessage?.includes("kurang") || toastMessage?.includes("Gagal") ? "error" : "success"}
          onClose={() => setShowToast(false)}
        />
      )}
    </motion.div>
  );
}
