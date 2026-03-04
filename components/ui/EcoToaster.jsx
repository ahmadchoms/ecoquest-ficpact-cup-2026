"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  AlertOctagon,
  Info,
  AlertTriangle,
  X,
} from "lucide-react";

const TOAST_TIMEOUT = 5000;

export default function EcoToaster({ position = "bottom-right" }) {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (e) => {
      const newToast = e.detail;
      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, TOAST_TIMEOUT);
    };

    window.addEventListener("eco-toast", handleToast);
    return () => window.removeEventListener("eco-toast", handleToast);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const positionClasses = {
    "top-right": "top-6 right-6 flex-col items-end",
    "top-left": "top-6 left-6 flex-col items-start",
    "bottom-right": "bottom-6 right-6 flex-col-reverse items-end",
    "bottom-left": "bottom-6 left-6 flex-col-reverse items-start",
  };

  const isTop = position.includes("top");

  return (
    <div
      className={`fixed z-9999 flex gap-3 pointer-events-none ${positionClasses[position]}`}
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <ToastCard
            key={t.id}
            toast={t}
            isTop={isTop}
            onRemove={() => removeToast(t.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastCard({ toast, isTop, onRemove }) {
  const config = {
    success: {
      icon: CheckCircle2,
      bg: "bg-[#b5f0c0]",
      border: "border-emerald-800",
    },
    error: { icon: AlertOctagon, bg: "bg-[#ff9999]", border: "border-red-900" },
    warn: {
      icon: AlertTriangle,
      bg: "bg-[#f5e642]",
      border: "border-yellow-900",
    },
    info: { icon: Info, bg: "bg-[#c9b8ff]", border: "border-purple-900" },
  };

  const style = config[toast.type] || config.info;
  const Icon = style.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: isTop ? -20 : 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`pointer-events-auto relative flex gap-4 w-80 p-4 border-3 border-black rounded-2xl shadow-hard text-black ${style.bg}`}
    >
      <div className="shrink-0 mt-0.5">
        <Icon size={24} className="stroke-[2.5px]" />
      </div>
      <div className="flex-1 pt-0.5">
        <h4 className="font-display font-black uppercase text-sm tracking-wide leading-tight mb-1">
          {toast.title}
        </h4>
        {toast.description && (
          <p className="font-body font-bold text-xs opacity-80 leading-snug">
            {toast.description}
          </p>
        )}
      </div>
      <button
        onClick={onRemove}
        className="shrink-0 p-1.5 hover:bg-black/10 rounded-xl transition-colors h-fit active:scale-90"
        aria-label="Tutup notifikasi"
      >
        <X size={16} className="stroke-[3px]" />
      </button>
    </motion.div>
  );
}
