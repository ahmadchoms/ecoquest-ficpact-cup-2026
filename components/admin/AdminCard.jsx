"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

export default function AdminCard({
  label,
  value,
  trend,
  icon: Icon,
  color = "bg-white",
  delay = 0,
}) {
  const isPositive = trend?.startsWith("+");
  const isNegative = trend?.startsWith("-");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`relative overflow-hidden p-6 border-3 border-black rounded-3xl shadow-hard transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-hard-lg ${color}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-white border-2 border-black rounded-2xl shadow-[3px_3px_0_#0f0f0f]">
          <Icon size={24} className="text-black" strokeWidth={2.5} />
        </div>

        {trend && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-lg border-2 border-black font-black text-xs shadow-[2px_2px_0_#0f0f0f] bg-white
            ${isPositive ? "text-emerald-600" : isNegative ? "text-red-500" : "text-slate-400"}`}
          >
            {isPositive ? (
              <ArrowUpRight size={14} />
            ) : isNegative ? (
              <ArrowDownRight size={14} />
            ) : (
              <Minus size={14} />
            )}
            {trend}
          </div>
        )}
      </div>

      <p className="text-xs font-black uppercase tracking-widest text-black/60 mb-1">
        {label}
      </p>
      <h3 className="text-3xl font-display font-black text-black">{value}</h3>

      {/* Background Decorative Element */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-black/5 rounded-full pointer-events-none" />
    </motion.div>
  );
}
