import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useTransition } from "react";
import { useUserStore } from "@/store/useUserStore";
import { X } from "lucide-react";

export default function EditProfileModal({ isOpen, onClose }) {
  // Mengambil state dari zustand store kamu
  const { explorerName } = useUserStore();
  const [name, setName] = useState("");
  const [, startTransition] = useTransition();

  // Sync nama saat modal dibuka
  useEffect(() => {
    if (isOpen) startTransition(() => setName(explorerName || ""));
  }, [isOpen, explorerName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update nama di zustand store
    // useUserStore.setState({ explorerName: name });
    onClose();
  };

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

          {/* Modal Content - Menggunakan class eco-card dari globals.css */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            // Menggabungkan eco-card dengan bg-grid-pattern yang ada di CSS kamu
            className="eco-card relative w-full max-w-md p-6 sm:p-8 bg-white bg-grid-pattern z-10 overflow-hidden"
          >
            {/* Dekorasi Blob ala Neo-brutalism */}
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

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
