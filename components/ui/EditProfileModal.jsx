import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useTransition } from "react";
import { useUserStore } from "@/store/useUserStore";
import { X, ChevronDown, Loader } from "lucide-react";
import { useUserItems, useUpdateUserItems } from "@/hooks/useUserItems";

export default function EditProfileModal({ isOpen, onClose }) {
  // Mengambil state dari zustand store kamu
  const { explorerName } = useUserStore();
  const [name, setName] = useState("");
  const [, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState("profile"); // "profile" | "banner" | "border"
  const [selectedBannerId, setSelectedBannerId] = useState(null);
  const [selectedBorderId, setSelectedBorderId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch user items
  const { data: items, isLoading: itemsLoading } = useUserItems();
  const updateMutation = useUpdateUserItems();

  // Sync nama saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      startTransition(() => setName(explorerName || ""));
      setActiveTab("profile");
      setShowSuccess(false);
    }
  }, [isOpen, explorerName]);

  // Set current selections when items load
  useEffect(() => {
    if (items && isOpen) {
      setSelectedBannerId(items.activeSelection?.bannerId || null);
      setSelectedBorderId(items.activeSelection?.borderId || null);
    }
  }, [items, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update nama di zustand store
    // useUserStore.setState({ explorerName: name });
    onClose();
  };

  const handleSaveItems = () => {
    updateMutation.mutate(
      {
        activeBannerId: selectedBannerId,
        activeBorderId: selectedBorderId,
      },
      {
        onSuccess: () => {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 2000);
        },
      }
    );
  };

  const banners = items?.banners || [];
  const borders = items?.borders || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="eco-card relative w-full max-w-2xl p-6 sm:p-8 bg-white bg-grid-pattern z-10 overflow-hidden"
          >
            {/* Dekorasi Blob */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow rounded-full animate-blob opacity-50 pointer-events-none border-3 border-black shadow-hard" />

            <div className="flex justify-between items-center mb-6 relative z-10">
              <h2 className="text-2xl font-display font-bold text-black uppercase tracking-wider">
                Edit Profil
              </h2>
              <button
                onClick={onClose}
                className="p-2 border-3 border-black rounded-xl bg-pink hover:bg-orange transition-colors shadow-hard active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                <X size={20} className="text-black" strokeWidth={3} />
              </button>
            </div>

            {/* Tabs Navigation */}
            <div className="flex gap-2 mb-6 relative z-10 border-b-3 border-black">
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-4 py-2 font-bold uppercase text-sm transition-all ${
                  activeTab === "profile"
                    ? "bg-green border-b-4 border-b-black text-black"
                    : "text-slate-600 hover:text-black"
                }`}
              >
                Profil
              </button>
              <button
                onClick={() => setActiveTab("banner")}
                className={`px-4 py-2 font-bold uppercase text-sm transition-all ${
                  activeTab === "banner"
                    ? "bg-blue border-b-4 border-b-black text-black"
                    : "text-slate-600 hover:text-black"
                }`}
              >
                Banner
              </button>
              <button
                onClick={() => setActiveTab("border")}
                className={`px-4 py-2 font-bold uppercase text-sm transition-all ${
                  activeTab === "border"
                    ? "bg-pink border-b-4 border-b-black text-black"
                    : "text-slate-600 hover:text-black"
                }`}
              >
                Border
              </button>
            </div>

            {/* Tab Content */}
            <div className="relative z-10">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block font-bold text-black uppercase text-sm">
                      Nama Explorer
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-white border-3 border-black rounded-2xl font-body text-black placeholder-slate-400 focus:outline-none focus:ring-0 shadow-hard focus:bg-mint transition-colors"
                      placeholder="Masukkan nama barumu..."
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 py-3 px-4 bg-white border-3 border-black text-black font-bold uppercase rounded-2xl shadow-hard hover:bg-gray-100 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 px-4 bg-green border-3 border-black text-black font-bold uppercase rounded-2xl shadow-hard hover:bg-mint active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                    >
                      Simpan
                    </button>
                  </div>
                </form>
              )}

              {/* Banner Tab */}
              {activeTab === "banner" && (
                <div className="space-y-6">
                  {itemsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader className="w-8 h-8 animate-spin text-black" />
                      <span className="ml-3 font-bold text-black">
                        Memuat Banner...
                      </span>
                    </div>
                  ) : banners.length === 0 ? (
                    <div className="text-center py-8 border-3 border-dashed border-slate-300 rounded-2xl">
                      <p className="font-bold text-slate-500">
                        Kamu belum memiliki banner apapun
                      </p>
                      <p className="text-sm text-slate-400 mt-2">
                        Mainkan misi atau beli dari shop untuk koleksi banner!
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                      {banners.map((banner) => (
                        <motion.button
                          key={banner.id}
                          onClick={() => setSelectedBannerId(banner.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-4 rounded-2xl border-3 transition-all text-left ${
                            selectedBannerId === banner.id
                              ? "border-green bg-green/10 shadow-hard"
                              : "border-black bg-white hover:bg-slate-50 shadow-hard"
                          }`}
                        >
                          {banner.previewUrl && (
                            <img
                              src={banner.previewUrl}
                              alt={banner.name}
                              className="w-full h-24 object-cover rounded-lg mb-3 border-2 border-black"
                            />
                          )}
                          <h3 className="font-bold text-black uppercase">
                            {banner.name}
                          </h3>
                          <p className="text-xs text-slate-600 mt-1">
                            {banner.description}
                          </p>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-xs font-bold bg-slate-200 px-2 py-1 rounded-lg">
                              {banner.rarity}
                            </span>
                            {selectedBannerId === banner.id && (
                              <span className="text-xs font-bold bg-green text-black px-2 py-1 rounded-lg">
                                ✓ Dipilih
                              </span>
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => setActiveTab("profile")}
                      className="flex-1 py-3 px-4 bg-white border-3 border-black text-black font-bold uppercase rounded-2xl shadow-hard hover:bg-gray-100 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                    >
                      Kembali
                    </button>
                    <button
                      onClick={handleSaveItems}
                      disabled={updateMutation.isPending}
                      className="flex-1 py-3 px-4 bg-blue border-3 border-black text-black font-bold uppercase rounded-2xl shadow-hard hover:bg-cyan disabled:opacity-50 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
                    >
                      {updateMutation.isPending ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Menyimpan...
                        </>
                      ) : (
                        "Simpan Pilihan"
                      )}
                    </button>
                  </div>

                  {showSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-green/20 border-3 border-green py-3 px-4 rounded-2xl text-center font-bold text-black"
                    >
                      ✓ Banner berhasil diperbarui!
                    </motion.div>
                  )}
                </div>
              )}

              {/* Border Tab */}
              {activeTab === "border" && (
                <div className="space-y-6">
                  {itemsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader className="w-8 h-8 animate-spin text-black" />
                      <span className="ml-3 font-bold text-black">
                        Memuat Border...
                      </span>
                    </div>
                  ) : borders.length === 0 ? (
                    <div className="text-center py-8 border-3 border-dashed border-slate-300 rounded-2xl">
                      <p className="font-bold text-slate-500">
                        Kamu belum memiliki border apapun
                      </p>
                      <p className="text-sm text-slate-400 mt-2">
                        Mainkan misi atau beli dari shop untuk koleksi border!
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                      {borders.map((border) => (
                        <motion.button
                          key={border.id}
                          onClick={() => setSelectedBorderId(border.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-4 rounded-2xl border-3 transition-all text-left ${
                            selectedBorderId === border.id
                              ? "border-pink bg-pink/10 shadow-hard"
                              : "border-black bg-white hover:bg-slate-50 shadow-hard"
                          }`}
                        >
                          {border.previewUrl && (
                            <img
                              src={border.previewUrl}
                              alt={border.name}
                              className="w-full h-24 object-cover rounded-lg mb-3 border-2 border-black"
                            />
                          )}
                          <h3 className="font-bold text-black uppercase">
                            {border.name}
                          </h3>
                          <p className="text-xs text-slate-600 mt-1">
                            {border.description}
                          </p>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-xs font-bold bg-slate-200 px-2 py-1 rounded-lg">
                              {border.rarity}
                            </span>
                            {selectedBorderId === border.id && (
                              <span className="text-xs font-bold bg-pink text-black px-2 py-1 rounded-lg">
                                ✓ Dipilih
                              </span>
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => setActiveTab("profile")}
                      className="flex-1 py-3 px-4 bg-white border-3 border-black text-black font-bold uppercase rounded-2xl shadow-hard hover:bg-gray-100 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                    >
                      Kembali
                    </button>
                    <button
                      onClick={handleSaveItems}
                      disabled={updateMutation.isPending}
                      className="flex-1 py-3 px-4 bg-pink border-3 border-black text-black font-bold uppercase rounded-2xl shadow-hard hover:bg-orange disabled:opacity-50 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
                    >
                      {updateMutation.isPending ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Menyimpan...
                        </>
                      ) : (
                        "Simpan Pilihan"
                      )}
                    </button>
                  </div>

                  {showSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-pink/20 border-3 border-pink py-3 px-4 rounded-2xl text-center font-bold text-black"
                    >
                      ✓ Border berhasil diperbarui!
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
