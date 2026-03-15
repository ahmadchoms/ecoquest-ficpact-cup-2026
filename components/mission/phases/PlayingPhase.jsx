"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function PlayingPhase({
  mission,
  MissionComponent,
  province,
  onComplete,
  onBack,
}) {
  return (
    <motion.div
      key="playing"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      className="fixed inset-0 z-50 bg-white bg-grid-pattern flex flex-col"
    >
      <div className="flex items-center justify-between px-3 sm:px-6 md:px-8 py-3 sm:py-4 bg-yellow border-b-[3px] border-black shadow-hard z-10 shrink-0">
        <h2 className="font-display font-black text-base sm:text-lg md:text-xl uppercase tracking-wider flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="bg-white border-[2.5px] border-black p-1 sm:p-1.5 rounded-lg sm:rounded-xl shadow-[2px_2px_0px_#0f0f0f] shrink-0 hidden xs:block">
            {mission.icon}
          </span>
          <span className="truncate">{mission.title}</span>
        </h2>
        <button
          onClick={onBack}
          className="shrink-0 bg-white border-[2.5px] border-black p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-black shadow-[3px_3px_0px_#0f0f0f] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all ml-2"
          aria-label="Tutup misi"
        >
          <X size={20} strokeWidth={3} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain bg-white">
        <div className="p-3 sm:p-4 md:p-8 max-w-5xl mx-auto w-full">
          {MissionComponent && (
            <MissionComponent
              province={province}
              mission={mission}
              onComplete={onComplete}
              onBack={onBack}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
