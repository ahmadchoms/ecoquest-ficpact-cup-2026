"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Zap,
  Play,
  ArrowRight,
} from "lucide-react";
import NeoButton from "@/components/ui/NeoButton";
import { getMissionStyle } from "@/utils/constants";
import { fadeIn, zoomIn } from "@/utils/motion-variants";

function RewardBadge({ icon, label, value, bgClass }) {
  return (
    <div
      className={`flex items-center gap-1.5 sm:gap-2 ${bgClass} text-black border-3 border-black shadow-hard rounded-2xl px-3 sm:px-4 py-2 font-display font-bold text-sm sm:text-base lg:text-lg whitespace-nowrap`}
    >
      {icon}
      <span>{value}</span>
      <span className="hidden sm:inline text-xs font-bold opacity-70 uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
}

export default function BriefingPhase({
  mission,
  province,
  alreadyDone,
  provinceId,
  onStart,
  router,
}) {
  const { bg } = getMissionStyle(mission.category);

  return (
    <motion.div
      key="briefing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
      className="max-w-5xl mx-auto px-4 py-6 sm:py-8"
    >
      <div className="flex items-center justify-between mb-6 sm:mb-10">
        <NeoButton
          onClick={() => router.push(`/province/${provinceId}`)}
          icon={<ArrowLeft size={16} strokeWidth={3} className="shrink-0" />}
          size="sm"
        >
          <span className="hidden sm:inline">Kembali</span>
        </NeoButton>
        <span className="bg-pink border-3 border-black px-3 sm:px-5 py-1.5 sm:py-2 rounded-2xl text-xs sm:text-sm font-display font-bold text-black shadow-hard uppercase tracking-wider truncate max-w-35 sm:max-w-none">
          {province.name}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 lg:gap-16 items-center">
        <motion.div
          variants={zoomIn(0.1)}
          initial="hidden"
          animate="visible"
          className="relative group flex justify-center md:justify-start"
        >
          <div
            className={`relative w-48 h-48 sm:w-64 sm:h-64 md:w-full md:aspect-square md:h-auto rounded-4xl ${bg} border-3 border-black flex items-center justify-center text-7xl sm:text-8xl md:text-9xl shadow-hard-xl transform group-hover:-translate-y-2 group-hover:-translate-x-2 group-hover:shadow-[16px_16px_0px_#0f0f0f] transition-all duration-300`}
          >
            <motion.span
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="filter drop-shadow-xl"
            >
              {mission.icon}
            </motion.span>
          </div>
        </motion.div>

        <motion.div
          variants={fadeIn("left", 0.2)}
          initial="hidden"
          animate="visible"
        >
          <div className="mb-4 sm:mb-6">
            <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-black text-white text-xs font-display font-bold uppercase tracking-widest rounded-xl mb-3 sm:mb-4 shadow-[3px_3px_0px_#f5e642]">
              Misi #{province.name}
            </span>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-black mb-2 sm:mb-4 leading-tight uppercase tracking-tight">
              {mission.title}
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-black/70 font-display font-bold uppercase tracking-wide">
              {mission.subtitle}
            </p>
          </div>

          <div className="bg-white rounded-3xl sm:rounded-4xl p-4 sm:p-6 md:p-8 border-3 border-black shadow-hard mb-6 sm:mb-8 relative overflow-hidden">
            <div className="absolute top-3 right-3 text-2xl sm:text-3xl opacity-10 animate-wiggle pointer-events-none select-none">
              {mission.icon}
            </div>
            <p className="text-black font-medium leading-relaxed text-sm sm:text-base lg:text-lg">
              {mission.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8 md:mb-10">
            <RewardBadge
              icon={<Zap size={18} strokeWidth={2.5} fill="currentColor" className="shrink-0" />}
              label="XP"
              value={`+${mission.xpReward} XP`}
              bgClass="bg-yellow"
            />
            <RewardBadge
              icon={<span className="text-base leading-none">💰</span>}
              label="Poin"
              value={`+${mission.pointsReward} Poin`}
              bgClass="bg-green"
            />
            <RewardBadge
              icon={<Clock size={18} strokeWidth={2.5} className="shrink-0" />}
              label="Waktu"
              value={mission.timeEstimate}
              bgClass="bg-white"
            />
            {alreadyDone && (
              <RewardBadge
                icon={<span className="text-base leading-none">✅</span>}
                label=""
                value="Selesai"
                bgClass="bg-mint"
              />
            )}
          </div>

          <button
            onClick={onStart}
            className="w-full py-4 sm:py-5 bg-green hover:bg-yellow text-black border-3 border-black rounded-2xl sm:rounded-3xl font-display font-black text-lg sm:text-xl md:text-2xl uppercase tracking-wider shadow-hard-lg hover:shadow-hard-xl hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all flex items-center justify-center gap-3 group"
          >
            <Play size={22} strokeWidth={3} fill="currentColor" className="shrink-0" />
            <span className="mt-0.5">
              {alreadyDone ? "Mainkan Ulang" : "Mulai Misi"}
            </span>
            <ArrowRight
              size={22}
              strokeWidth={3}
              className="shrink-0 group-hover:translate-x-1.5 transition-transform"
            />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
