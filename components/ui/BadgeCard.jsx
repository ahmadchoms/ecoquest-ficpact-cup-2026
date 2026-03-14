import { motion } from "framer-motion";
import { Lock } from "lucide-react";

export default function BadgeCard({ badge, earned = false, onClick }) {
  // Menggunakan palet warna dari globals.css
  const rarityColors = {
    legendary: "bg-yellow",
    epic: "bg-purple",
    rare: "bg-mint",
    uncommon: "bg-green",
    common: "bg-white",
  };

  const bgClass = rarityColors[badge.rarity] || "bg-white";

  return (
    <motion.div
      whileHover={earned ? { scale: 1.05 } : {}}
      whileTap={earned ? { scale: 0.95 } : {}}
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-center p-5 rounded-3xl transition-all border-3 overflow-hidden
        ${
          earned
            ? `${bgClass} border-black shadow-hard hover:shadow-hard-lg cursor-pointer`
            : "bg-gray-100 border-black border-dashed cursor-not-allowed"
        }
      `}
    >
      {/* Bungkus konten badge agar bisa diblur bersamaan saat terkunci */}
      <div
        className={`flex flex-col items-center transition-all duration-300 ${!earned ? "opacity-30 grayscale blur-[2px]" : ""}`}
      >
        <div className="text-5xl mb-3">{badge.icon}</div>
        <p className="text-sm font-display font-bold text-center text-black leading-tight mb-2">
          {badge.name}
        </p>

        {/* Rarity Tag ala Brutalism */}
        <span className="px-3 py-1 rounded-full border-2 border-black text-[10px] font-bold uppercase bg-white text-black shadow-[2px_2px_0_#0f0f0f]">
          {badge.rarity}
        </span>
      </div>

      {/* Overlay Gembok yang Super Jelas */}
      {!earned && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="bg-black text-white p-3 rounded-full border-3 border-white shadow-hard transform -rotate-12">
            <Lock size={28} strokeWidth={2.5} />
          </div>
        </div>
      )}
    </motion.div>
  );
}
