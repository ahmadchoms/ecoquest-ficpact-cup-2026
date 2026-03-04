import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

export default function KPICard({
  label,
  value,
  trend,
  icon: Icon,
  color,
  index,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`p-6 border-3 border-black rounded-3xl shadow-hard relative overflow-hidden group ${color}`}
    >
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2">
            {label}
          </p>
          <h3 className="text-3xl font-display font-black">{value}</h3>
        </div>
        <div className="w-12 h-12 bg-white border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0_#0f0f0f]">
          <Icon size={24} className="text-black" />
        </div>
      </div>
      <div className="mt-4 inline-flex items-center gap-1 px-2 py-1 bg-white border-2 border-black rounded-lg text-xs font-black">
        <TrendingUp size={14} className="text-emerald-600" /> {trend}
      </div>
    </motion.div>
  );
}
