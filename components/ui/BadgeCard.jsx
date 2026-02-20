import { motion } from "framer-motion";
import { Lock } from "lucide-react";
// import { rarityColor } from "../../utils/formatters"; // Legacy util may give hex codes, can reuse or simplify

export default function BadgeCard({ badge, earned = false, onClick }) {
  
  // Map rarity to new palette classes if needed, or use borders
  const rarityColors = {
    legendary: "bg-yellow",
    epic: "bg-purple",
    rare: "bg-blue-300", // Tailwind default or custom
    uncommon: "bg-green",
    common: "bg-white"
  };

  const bgClass = rarityColors[badge.rarity] || "bg-white";

  return (
    <motion.div
      whileHover={earned ? { scale: 1.05 } : {}}
      whileTap={earned ? { scale: 0.95 } : {}}
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-center p-4 rounded-2xl transition-all cursor-pointer border-3 border-black
        ${earned ? `${bgClass} shadow-hard hover:shadow-hard-lg` : "bg-gray-100 grayscale opacity-60 shadow-none border-dashed"}
      `}
    >
      <div className="text-4xl mb-2">
        {badge.icon}
      </div>
      <p className="text-xs font-display font-bold text-center text-black leading-tight">
        {badge.name}
      </p>
      
      {/* Rarity Tag */}
      <span className="mt-1 px-2 py-0.5 rounded-full border border-black text-[9px] font-bold uppercase bg-white">
        {badge.rarity}
      </span>

      {!earned && (
        <div className="absolute inset-0 flex items-center justify-center bg-transparent">
          <Lock size={20} className="text-black opacity-50" />
        </div>
      )}
    </motion.div>
  );
}
