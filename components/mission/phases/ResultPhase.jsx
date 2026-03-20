"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Star,
  RotateCcw,
  Trophy,
  ArrowRight,
} from "lucide-react";

export default function ResultPhase({
  mission,
  missionResult,
  provinceId,
  alreadyDone,
  onReplay,
  router,
}) {
  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-lg mx-auto px-4 py-8 sm:py-12 text-center"
    >
      <div className="bg-white border-3 border-black shadow-hard px-6 py-8 sm:p-10 rounded-3xl sm:rounded-4xl mb-6 sm:mb-8">
        <div className="text-5xl sm:text-6xl mb-3 sm:mb-4 animate-wiggle inline-block">
          🎉
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-black uppercase tracking-tight mb-2 sm:mb-4 leading-tight">
          Misi Selesai!
        </h2>
        <p className="text-base sm:text-lg md:text-xl font-display font-bold text-black/70 uppercase">
          Hebat, kamu telah menyelesaikan misi ini.
        </p>

        {missionResult?.performancePercent != null && (
          <div className="mt-6 flex items-center justify-center gap-2 bg-yellow border-3 border-black rounded-2xl px-4 py-3 shadow-hard">
            <Star size={20} fill="currentColor" strokeWidth={2} />
            <span className="font-display font-black text-xl">
              {missionResult.performancePercent}%
            </span>
            <span className="font-display font-bold text-sm uppercase tracking-wide opacity-70">
              Skor
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-6 sm:mb-8">
        <div className="flex items-center gap-2 bg-yellow border-3 border-black shadow-hard rounded-2xl px-4 py-2.5 font-display font-bold text-base sm:text-lg">
          <Zap size={18} strokeWidth={2.5} fill="currentColor" />+
          {missionResult?.earnedXP ?? mission?.xpReward} XP
        </div>
        <div className="flex items-center gap-2 bg-green border-3 border-black shadow-hard rounded-2xl px-4 py-2.5 font-display font-bold text-base sm:text-lg">
          💰 +{missionResult?.earnedPoints ?? mission?.pointsReward ?? mission?.pointReward ?? 0} Poin
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {!alreadyDone && (
          <button
            onClick={onReplay}
            className="flex-1 py-3.5 sm:py-4 bg-white hover:bg-pink border-3 border-black text-black rounded-2xl sm:rounded-3xl font-display font-bold text-base sm:text-lg md:text-xl uppercase flex items-center justify-center gap-2 sm:gap-3 shadow-hard hover:-translate-x-1 hover:-translate-y-1 transition-all active:translate-x-0 active:translate-y-0 active:shadow-none"
          >
            <RotateCcw size={20} strokeWidth={3} />
            Main Lagi
          </button>
        )}
        <button
          onClick={() => router.push(`/province/${provinceId}`)}
          className="flex-1 py-3.5 sm:py-4 bg-green hover:bg-yellow border-3 border-black text-black rounded-2xl sm:rounded-3xl font-display font-bold text-base sm:text-lg md:text-xl uppercase flex items-center justify-center gap-2 sm:gap-3 shadow-hard hover:-translate-x-1 hover:-translate-y-1 transition-all active:translate-x-0 active:translate-y-0 active:shadow-none"
        >
          <Trophy size={20} strokeWidth={3} />
          Lanjut
          <ArrowRight size={20} strokeWidth={3} />
        </button>
      </div>
    </motion.div>
  );
}
