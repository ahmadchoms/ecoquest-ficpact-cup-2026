import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import EcoCard from "../design-system/EcoCard";

export default function ImpactCard({ icon, value, unit, label, delay = 0 }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    if (latest >= 1000) return (latest / 1000).toFixed(1) + 'K';
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
    >
      <EcoCard variant="feature" className="p-4 flex items-center gap-3 h-full">
        <div className="text-3xl flex-shrink-0 bg-white border-2 border-black rounded-lg w-12 h-12 flex items-center justify-center shadow-[2px_2px_0_#000]">
          {icon}
        </div>
        <div>
          <div className="flex items-baseline gap-1">
            <motion.span className="text-xl font-display font-extrabold text-black">
              {rounded}
            </motion.span>
            <span className="text-xs font-bold text-black font-body">{unit}</span>
          </div>
          <p className="text-xs text-[#555] font-medium leading-tight">{label}</p>
        </div>
      </EcoCard>
    </motion.div>
  );
}
