"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi Tindakan",
  message = "Apakah Anda yakin ingin melanjutkan?",
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  isLoading = false,
  isDestructive = true,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-999 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isLoading ? onClose : undefined}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.4 }}
            className="relative w-full max-w-md bg-white border-4 border-black rounded-3xl p-6 shadow-hard-xl z-10"
          >
            <button
              onClick={onClose}
              disabled={isLoading}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 border-2 border-black rounded-xl transition-colors disabled:opacity-50"
            >
              <X size={16} className="stroke-[3px]" />
            </button>

            <div
              className={`w-16 h-16 mb-5 border-3 border-black rounded-2xl flex items-center justify-center shadow-hard ${isDestructive ? "bg-red-300 text-red-700" : "bg-yellow text-black"}`}
            >
              <AlertTriangle size={32} className="stroke-[2.5px]" />
            </div>

            <h3 className="text-2xl font-display font-black text-black leading-tight mb-2">
              {title}
            </h3>
            <p className="text-sm font-body font-bold text-slate-600 mb-8 leading-relaxed">
              {message}
            </p>

            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 py-3 px-4 bg-white hover:bg-slate-100 text-black border-3 border-black rounded-xl font-display font-black text-xs uppercase tracking-widest transition-colors disabled:opacity-50"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 border-3 border-black rounded-xl font-display font-black text-xs uppercase tracking-widest transition-all shadow-[3px_3px_0_#0f0f0f] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed ${
                  isDestructive
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-black hover:bg-gray-800 text-white"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    {isDestructive ? <Trash2 size={16} /> : null}
                    <span>{confirmText}</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
