"use client";

import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import ItemCard from "@/components/shop/ItemCard";
import PurchaseConfirmation from "@/components/shop/PurchaseConfirmation";
import Toast from "@/components/ui/Toast";
import { useUserStore } from "@/store/useUserStore";
import { usePurchaseShopItem } from "@/hooks/useUserMissions";
import { staggerContainer, fadeIn } from "@/utils/motion-variants";
import { ChevronLeft } from "lucide-react";

export default function CollectionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const collectionId = params.collectionId;
  const { points: userPoints, deductCoins } = useUserStore();
  const purchaseMutation = usePurchaseShopItem();

  const [collection, setCollection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch event + items dari API
  useEffect(() => {
    const fetchCollection = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/events/${collectionId}`);
        
        if (!response.ok) {
          console.error("Collection not found");
          setCollection(null);
          return;
        }

        const data = await response.json();
        setCollection(data.data);
      } catch (error) {
        console.error("Error fetching collection:", error);
        setCollection(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollection();
  }, [collectionId]);

  if (isLoading) {
    return (
      <PageWrapper className="min-h-screen bg-white pt-20 pb-24 font-body">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <p className="text-slate-600 font-medium">Memuat koleksi...</p>
        </div>
      </PageWrapper>
    );
  }

  if (!collection) {
    return (
      <PageWrapper className="min-h-screen bg-white pt-20 pb-24 font-body">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="font-display text-3xl font-extrabold mb-4">
            Koleksi Tidak Ditemukan
          </h1>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl shadow-hard hover:shadow-hard-lg transition-all"
          >
            Kembali ke Toko
          </button>
        </div>
      </PageWrapper>
    );
  }

  const handleBuyItem = (item) => {
    if (userPoints < item.price) {
      setToastMessage(`Poin tidak cukup! Kamu membutuhkan ${item.price - userPoints} poin lagi.`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    setSelectedItem(item);
    setShowConfirmation(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedItem) return;
    
    try {
      setIsProcessing(true);
      await purchaseMutation.mutateAsync(selectedItem.id);
      deductCoins(selectedItem.price);
      setShowConfirmation(false);
      setToastMessage(`${selectedItem.name} berhasil dibeli!`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (error) {
      setToastMessage(error.response?.data?.message || "Gagal membeli item. Silakan coba lagi.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBuyAll = async () => {
    if (!collection || !collection.items || collection.items.length === 0) return;
    
    // Calculate total cost
    const totalCost = collection.items.reduce((sum, item) => sum + item.price, 0);
    
    if (userPoints < totalCost) {
      setToastMessage(`Poin tidak cukup! Total kebutuhan ${totalCost} poin, kamu kekurangan ${totalCost - userPoints} poin.`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    
    try {
      setIsProcessing(true);
      // Beli semua item satu per satu
      for (const item of collection.items) {
        await purchaseMutation.mutateAsync(item.id);
      }
      deductCoins(totalCost);
      setToastMessage(
        `${collection.items.length} item berhasil dibeli! Selamat berbelanja!`
      );
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (error) {
      setToastMessage("Gagal membeli beberapa item. Silakan coba lagi.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsProcessing(false);
    }
  };

  const staggerContainer2 = {
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
    <PageWrapper className="min-h-screen bg-white pt-20 pb-24 font-body">
      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-4 py-6 space-y-8"
      >
        {/* Back Button */}
        <motion.button
          variants={fadeIn("down", 0.05)}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-bold transition-colors group"
        >
          <ChevronLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Kembali ke Toko
        </motion.button>

        {/* Collection Header */}
        <motion.div
          variants={fadeIn("down", 0.1)}
          className="space-y-4"
        >
          {collection && (
            <>
              <div
                className="w-full h-48 sm:h-64 rounded-2xl border-3 border-black shadow-hard overflow-hidden relative bg-cover bg-center"
                style={{
                  backgroundImage: collection.imageUrl
                    ? `url('${collection.imageUrl}')`
                    : 'none',
                  backgroundColor: !collection.imageUrl ? '#f0f0f0' : 'transparent',
                }}
              >
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white text-center drop-shadow-lg">
                    {collection.title}
                  </h1>
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-black">
                  {collection.subtitle}
                </h2>
                <p className="text-slate-600 text-base sm:text-lg font-medium">
                  {collection.description}
                </p>
              </div>
            </>
          )}
        </motion.div>

        {/* Buy All Button */}
        {collection && (
          <motion.div
            variants={fadeIn("up", 0.15)}
            className="flex gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBuyAll}
              disabled={isProcessing}
              className="flex-1 px-6 py-4 bg-emerald-500 text-white font-display font-extrabold text-lg rounded-xl border-3 border-black shadow-hard hover:shadow-hard-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Memproses...
                </>
              ) : (
                `🛒 Beli Semua (${collection.items.length} item)`
              )}
            </motion.button>
          </motion.div>
        )}

        {/* Items Grid */}
        {collection && (
          <motion.div
            variants={staggerContainer2}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            <h3 className="font-display text-xl font-extrabold text-black">
              Item dalam Koleksi Ini
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {collection && collection.items && collection.items.map((item, index) => (
                <motion.div key={item.id} variants={itemVariant}>
                  <ItemCard 
                    item={item} 
                    delay={index * 0.02}
                    onBuyClick={() => handleBuyItem(item)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Purchase Confirmation Modal */}
      {showConfirmation && (
        <PurchaseConfirmation
          isOpen={showConfirmation}
          item={selectedItem}
          onConfirm={handleConfirmPurchase}
          onCancel={() => setShowConfirmation(false)}
          isLoading={isProcessing}
        />
      )}

      {/* Toast Notification */}
      {showToast && (
        <Toast
          isOpen={showToast}
          message={toastMessage}
          type={toastMessage?.includes("kurang") ? "error" : "success"}
          onClose={() => setShowToast(false)}
        />
      )}
    </PageWrapper>
  );
}
