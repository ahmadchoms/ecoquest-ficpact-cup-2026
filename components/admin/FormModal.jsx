"use client";

import { useEffect } from "react";
import { X, Save, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FormModal({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  isLoading,
  error,
  submitLabel = "Simpan Data",
  size = "md",
}) {
  // Scroll locking
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const sizes = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-100"
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-101 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`w-full ${sizes[size]} bg-white border-4 border-black rounded-5xl shadow-[12px_12px_0_#0f0f0f] pointer-events-auto flex flex-col max-h-[90vh] overflow-hidden`}
            >
              {/* Header */}
              <div className="px-8 py-6 border-b-4 border-black flex items-center justify-between bg-yellow text-black">
                <h2 className="text-2xl font-display font-black uppercase tracking-tight">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 bg-white border-2 border-black rounded-xl hover:bg-slate-50 shadow-hard active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                >
                  <X size={20} className="stroke-3" />
                </button>
              </div>

              {/* Body */}
              <form
                onSubmit={onSubmit}
                className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide"
              >
                {error && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 border-2 border-red-500 rounded-2xl text-red-600 font-bold text-sm">
                    <AlertCircle size={20} />
                    {error}
                  </div>
                )}

                <div className="space-y-6">{children}</div>
              </form>

              {/* Footer */}
              <div className="px-8 py-6 border-t-4 border-black bg-slate-50 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-8 py-3 bg-white border-3 border-black rounded-2xl font-display font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={onSubmit}
                  disabled={isLoading}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-3.5 bg-black text-white border-3 border-black rounded-2xl font-display font-black text-xs uppercase tracking-widest shadow-hard hover:shadow-hard-lg hover:-translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:hover:translate-y-0 transition-all"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  {isLoading ? "Memproses..." : submitLabel}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
