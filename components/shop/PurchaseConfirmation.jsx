"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function PurchaseConfirmation({
  isOpen = false,
  item = null,
  items = null, // Batch mode: array of items
  ownedItems = null, // Batch mode: array of owned items
  onConfirm = () => {},
  onCancel = () => {},
  isLoading = false,
}) {
  // Determine if batch mode
  const isBatch = items && Array.isArray(items) && items.length > 0;
  
  if (!isBatch && !item) return null;

  // For batch mode, calculate total cost
  const totalCost = isBatch 
    ? items.reduce((sum, item) => sum + item.price, 0)
    : item?.price || 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/40 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-white rounded-2xl border-3 border-black shadow-hard-xl overflow-hidden">
              {/* Header */}
              <div className="bg-emerald-100 p-6 border-b-3 border-black">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-display text-2xl font-extrabold text-black mb-1">
                      {isBatch ? "Konfirmasi Pembelian Batch" : "Konfirmasi Pembelian"}
                    </h2>
                    <p className="text-sm text-black/70 font-medium">
                      {isBatch 
                        ? `${items.length} item akan dibeli${ownedItems?.length ? ` (${ownedItems.length} sudah dimiliki)` : ""}`
                        : "Pastikan item yang Anda pilih"
                      }
                    </p>
                  </div>
                  <button
                    onClick={onCancel}
                    disabled={isLoading}
                    className="text-black hover:bg-white/50 p-1 rounded-lg transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {isBatch ? (
                  <>
                    {/* Batch Mode: Items to be purchased */}
                    {items.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="font-display font-bold text-emerald-700 text-sm">
                          ✓ ITEM YANG AKAN DIBELI ({items.length})
                        </h3>
                        <div className="bg-emerald-50 rounded-xl p-4 space-y-2 border-2 border-emerald-200 max-h-40 overflow-y-auto">
                          {items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between bg-white rounded-lg p-3 border border-emerald-100"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <span className="text-2xl">{item.image}</span>
                                <div className="flex-1">
                                  <p className="font-bold text-sm text-black">{item.name}</p>
                                  <p className="text-xs text-black/60">{item.rarity}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-display font-bold text-emerald-600">{item.price}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Batch Mode: Already owned items */}
                    {ownedItems?.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="font-display font-bold text-slate-600 text-sm">
                          ⚠ ITEM YANG SUDAH DIMILIKI ({ownedItems.length})
                        </h3>
                        <div className="bg-slate-100 rounded-xl p-4 space-y-2 border-2 border-slate-300 max-h-40 overflow-y-auto">
                          {ownedItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between bg-white rounded-lg p-3 border border-slate-200 opacity-70"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <span className="text-2xl opacity-60">{item.image}</span>
                                <div className="flex-1">
                                  <p className="font-bold text-sm text-slate-500 line-through">{item.name}</p>
                                  <p className="text-xs text-slate-500">{item.rarity}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-display font-bold text-slate-400 line-through">{item.price}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Total Cost */}
                    <div className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200">
                      <div className="flex justify-between items-center">
                        <span className="font-display font-bold text-lg text-black">Total Biaya:</span>
                        <div className="flex items-baseline gap-1">
                          <span className="font-display font-extrabold text-2xl text-emerald-600">
                            {totalCost}
                          </span>
                          <span className="text-sm font-bold text-black/60">Koin</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Single Item Mode */}
                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl p-6 flex flex-col items-center gap-4 border-2 border-black">
                      <div className="text-6xl">{item.image}</div>
                      <div className="text-center">
                        <h3 className="font-display font-bold text-lg text-black">
                          {item.name}
                        </h3>
                        <p className="text-sm text-black/60 font-medium mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Item Details */}
                    <div className="bg-slate-50 rounded-xl p-4 space-y-3 border-2 border-slate-200">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-black/70">Tipe Item:</span>
                        <span className="font-bold text-black">
                          {item.type === "exclusive" ? "Eksklusif" : "Umum"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-black/70">Rarity:</span>
                        <span className="inline-block px-3 py-1 rounded-lg text-xs font-bold bg-yellow-200 text-yellow-800">
                          {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
                        </span>
                      </div>
                      <div className="h-px bg-slate-200" />
                      <div className="flex justify-between items-center">
                        <span className="font-display font-bold text-lg text-black">
                          Harga:
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="font-display font-extrabold text-2xl text-emerald-600">
                            {item.price}
                          </span>
                          <span className="text-sm font-bold text-black/60">Koin</span>
                        </div>
                      </div>
                    </div>

                    {/* Confirmation Text */}
                    <div className="bg-blue-50 rounded-xl p-3 border-2 border-blue-200">
                      <p className="text-sm text-blue-900 font-medium">
                        ✓ Item ini akan ditambahkan ke koleksi Anda
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="p-6 bg-slate-50 border-t-3 border-black flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onCancel}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-slate-300 text-black font-bold rounded-xl border-2 border-black shadow-hard hover:shadow-hard-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Batal
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-emerald-500 text-white font-bold rounded-xl border-2 border-black shadow-hard hover:shadow-hard-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      Memproses...
                    </>
                  ) : (
                    isBatch ? "Beli Semuanya" : "Beli Sekarang"
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
