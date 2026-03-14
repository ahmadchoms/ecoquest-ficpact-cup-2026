"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
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
  formId = "form-modal",
}) {
  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && !isLoading) onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, isLoading, onClose]);

  const sizes = {
    sm: "max-w-lg",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Full-screen backdrop — sits above everything */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/65 backdrop-blur-[3px]"
            style={{ zIndex: 9998 }}
            onClick={!isLoading ? onClose : undefined}
            aria-hidden="true"
          />

          {/* Modal scroll container — full screen, centres the card */}
          <div
            className="fixed inset-0 flex items-center justify-center p-4 sm:p-6"
            style={{ zIndex: 9999 }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="form-modal-title"
              initial={{ opacity: 0, scale: 0.97, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 24 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className={`
                relative w-full ${sizes[size]}
                bg-white border-4 border-black
                rounded-[2rem] overflow-hidden
                flex flex-col
                max-h-[calc(100vh-2rem)]
                shadow-[16px_16px_0_#0f0f0f]
              `}
              onClick={(e) => e.stopPropagation()}
            >
              {/* ── Coloured accent stripe (left edge) ─────────────── */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-yellow rounded-l-[1.875rem]" />

              {/* ── Header ──────────────────────────────────────────── */}
              <div className="flex items-center justify-between pl-8 pr-6 py-5 border-b-4 border-black bg-yellow shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-black rounded-full" />
                  <h2
                    id="form-modal-title"
                    className="text-xl font-display font-black uppercase tracking-tight text-black leading-none"
                  >
                    {title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  aria-label="Tutup modal"
                  className="
                    p-2 bg-white border-2 border-black rounded-xl
                    hover:bg-black hover:text-white
                    shadow-[3px_3px_0_#0f0f0f] active:shadow-none active:translate-x-0.5 active:translate-y-0.5
                    disabled:opacity-40 disabled:cursor-not-allowed
                    transition-all duration-150
                  "
                >
                  <X size={18} strokeWidth={3} />
                </button>
              </div>

              {/* ── Scrollable Body ──────────────────────────────────── */}
              <form
                id={formId}
                onSubmit={onSubmit}
                className="flex-1 overflow-y-auto overscroll-contain px-8 py-6 space-y-6 scrollbar-hide"
              >
                {/* Error banner */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-400 rounded-2xl text-red-700 text-sm font-bold"
                  >
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <div className="space-y-6">{children}</div>
              </form>

              {/* ── Footer ───────────────────────────────────────────── */}
              <div className="shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 px-8 py-5 border-t-4 border-black bg-slate-50">
                {/* Left hint */}
                <p className="hidden sm:block text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Tekan Esc untuk batal
                </p>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* Cancel */}
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className="
                      flex-1 sm:flex-none px-6 py-2.5
                      bg-white border-2 border-black rounded-2xl
                      font-display font-black text-xs uppercase tracking-widest
                      shadow-[3px_3px_0_#0f0f0f]
                      hover:bg-slate-100
                      active:shadow-none active:translate-x-0.5 active:translate-y-0.5
                      disabled:opacity-40 disabled:cursor-not-allowed
                      transition-all duration-150
                    "
                  >
                    Batal
                  </button>

                  {/* Submit */}
                  <button
                    form={formId}
                    type="submit"
                    disabled={isLoading}
                    className="
                      flex-1 sm:flex-none flex items-center justify-center gap-2.5
                      px-8 py-2.5
                      bg-black text-white
                      border-2 border-black rounded-2xl
                      font-display font-black text-xs uppercase tracking-widest
                      shadow-[3px_3px_0_#555]
                      hover:shadow-[5px_5px_0_#555] hover:-translate-y-0.5
                      active:shadow-none active:translate-x-0.5 active:translate-y-0.5
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[3px_3px_0_#555]
                      transition-all duration-150
                    "
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Save size={15} strokeWidth={3} />
                    )}
                    {isLoading ? "Memproses..." : submitLabel}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  // Use a portal so the modal renders directly in <body>,
  // escaping all CSS stacking contexts from the admin layout.
  if (typeof window === "undefined") return null;
  return createPortal(modalContent, document.body);
}
