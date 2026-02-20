import { motion } from "framer-motion";

export default function XPBar({ current, max, level, showLabel = true, size = "md" }) {
  const percentage = Math.min((current / max) * 100, 100);
  const heights = { sm: "h-2", md: "h-4", lg: "h-6" };

  return (
    <div className="w-full font-body">
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-black uppercase tracking-wider">Lvl {level}</span>
          <span className="text-xs font-bold text-black">{current} / {max} XP</span>
        </div>
      )}
      
      {/* Track */}
      <div className={`w-full ${heights[size]} bg-white border-2 border-black rounded-full overflow-hidden relative shadow-[2px_2px_0_#000]`}>
        {/* Fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full bg-green rounded-full relative border-r-2 border-black"
          style={{ boxSizing: 'border-box' }} // Ensure border is inside or handles logic correctly
        >
          {/* Shine/Pattern */}
          <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,#000_5px,#000_6px)]" />
        </motion.div>
      </div>
    </div>
  );
}
