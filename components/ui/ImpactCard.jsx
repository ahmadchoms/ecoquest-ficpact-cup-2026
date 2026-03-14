import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import EcoCard from "@/components/design-system/EcoCard";

export default function ImpactCard({ icon, value, unit, label, delay = 0 }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    if (latest >= 1000) return (latest / 1000).toFixed(1) + "K";
    return latest < 10 ? latest.toFixed(1) : Math.round(latest);
  });

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.5,
      delay,
      ease: "easeOut",
    });
    return controls.stop;
  }, [value, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay }}
      className="h-full"
    >
      <div className="bg-white border-3 border-black p-4 rounded-3xl shadow-hard hover:-translate-y-1 hover:shadow-hard-lg hover:bg-mint transition-all duration-200 flex items-center gap-4 h-full group cursor-default">
        {/* Ikon bergaya stiker Brutalism */}
        <div className="text-3xl shrink-0 bg-yellow border-3 border-black rounded-xl w-14 h-14 flex items-center justify-center shadow-[3px_3px_0_#0f0f0f] -rotate-3 group-hover:rotate-0 transition-transform duration-300">
          {icon}
        </div>

        <div>
          <div className="flex items-baseline gap-1">
            <motion.span className="text-2xl font-display font-black text-black">
              {rounded}
            </motion.span>
            <span className="text-xs font-bold text-black uppercase tracking-wider">
              {unit}
            </span>
          </div>
          <p className="text-xs text-black/70 font-bold uppercase mt-0.5 leading-tight">
            {label}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
