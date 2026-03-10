"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle, Info, X } from "lucide-react";

export default function Toast({
  isOpen = false,
  message = "",
  type = "success",
  onClose = () => {},
}) {
  const icons = {
    success: <Check size={20} />,
    error: <AlertCircle size={20} />,
    info: <Info size={20} />,
  };

  const colors = {
    success: "bg-emerald-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: 100 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20, x: 100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl border-2 border-black shadow-hard font-medium text-sm sm:text-base ${colors[type]}`}
        >
          <span className="flex-shrink-0">{icons[type]}</span>
          <span className="flex-1">{message}</span>
          <button
            onClick={onClose}
            className="flex-shrink-0 hover:opacity-80 transition-opacity"
          >
            <X size={18} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
