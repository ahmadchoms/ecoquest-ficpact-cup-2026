"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, Star, Info, Play, Lock, MapPin } from "lucide-react";
import { difficultyLabel } from "@/utils/formatters";

export function MissionCard({
  mission,
  index,
  status,
  provinceId,
  totalMissions,
}) {
  const diff = difficultyLabel(mission.difficulty);
  const isCompleted = status === "completed";
  const isLocked = status === "locked";

  const cardClasses = isCompleted
    ? "bg-mint border-black shadow-hard hover:-translate-x-1 hover:-translate-y-1"
    : !isLocked
      ? "bg-white border-black shadow-hard hover:-translate-x-1 hover:-translate-y-1 hover:bg-yellow cursor-pointer"
      : "bg-gray-100 border-black opacity-80 grayscale cursor-not-allowed shadow-none translate-x-1 translate-y-1";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      className="relative w-90 sm:w-full"
    >
      {index < totalMissions - 1 && (
        <div className="absolute left-10 top-28 -bottom-12 w-0.75 bg-black z-0 hidden md:block ml-0.5 border-dashed" />
      )}

      <div
        className={`relative rounded-4xl p-6 md:p-8 border-3 transition-all duration-300 transform ${cardClasses}`}
      >
        {!isLocked ? (
          <Link
            href={`/mission/${provinceId}/${mission.id}`}
            className="flex flex-col md:flex-row items-center gap-8 group"
          >
            <div className="relative z-10 shrink-0">
              <div className="w-24 h-24 rounded-3xl bg-white border-3 border-black flex items-center justify-center text-5xl shadow-hard-lg group-hover:scale-110 group-hover:rotate-6 group-hover:bg-pink transition-all duration-300">
                {mission.icon}
              </div>
              {isCompleted && (
                <div className="absolute -bottom-3 -right-3 bg-green text-black p-2.5 rounded-full border-3 border-black shadow-hard">
                  <CheckCircle2 size={24} strokeWidth={3} />
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                <h4 className="font-display text-3xl font-black text-black uppercase tracking-tight">
                  {mission.title}
                </h4>
                <span
                  className={`px-4 py-1.5 rounded-xl border-3 border-black shadow-[3px_3px_0px_#0f0f0f] text-sm font-display font-bold uppercase ${diff.bg} ${diff.color}`}
                >
                  {diff.text}
                </span>
              </div>
              <p className="text-black/80 font-medium text-lg leading-relaxed max-w-2xl">
                {mission.description}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-4 text-sm pt-2">
                <span className="flex items-center gap-2 bg-yellow border-[2.5px] border-black shadow-[3px_3px_0px_#0f0f0f] text-black font-display font-bold px-4 py-2 rounded-xl">
                  <Star size={18} strokeWidth={2.5} fill="currentColor" /> +
                  {mission.xpReward} XP
                </span>
                <span className="flex items-center gap-2 bg-white border-[2.5px] border-black shadow-[3px_3px_0px_#0f0f0f] text-black font-display font-bold px-4 py-2 rounded-xl">
                  <Info size={18} strokeWidth={2.5} /> {mission.timeEstimate}
                </span>
              </div>
            </div>

            <div className="shrink-0 mt-6 md:mt-0">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center border-3 border-black shadow-hard transition-all duration-300 ${isCompleted ? "bg-green text-black" : "bg-orange text-black group-hover:scale-110"}`}
              >
                {isCompleted ? (
                  <CheckCircle2 size={32} strokeWidth={3} />
                ) : (
                  <Play
                    size={30}
                    strokeWidth={2.5}
                    fill="currentColor"
                    className="ml-1"
                  />
                )}
              </div>
            </div>
          </Link>
        ) : (
          <div className="flex flex-col md:flex-row items-center gap-8 opacity-70">
            <div className="w-24 h-24 rounded-3xl bg-gray-200 border-3 border-black flex items-center justify-center text-black shadow-none shrink-0">
              <Lock size={36} strokeWidth={2.5} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="font-display text-3xl font-black text-black mb-3 uppercase tracking-tight">
                {mission.title}
              </h4>
              <p className="text-black font-display font-bold bg-white border-3 border-black shadow-hard px-5 py-2.5 rounded-2xl inline-block">
                🔒 Selesaikan misi sebelumnya untuk membuka
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function MissionList({
  missions,
  provinceId,
  unlockStatuses,
  doneCount,
}) {
  return (
    <div className="pt-12 pb-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
        <h3 className="font-display text-4xl font-black text-black flex items-center gap-4 uppercase">
          <span className="bg-green border-3 border-black p-3.5 rounded-2xl shadow-hard">
            <MapPin size={32} />
          </span>
          Jalur Misi
        </h3>
        <span className="bg-yellow border-3 border-black text-black font-display font-bold px-8 py-3 rounded-2xl shadow-hard">
          {doneCount} / {missions.length} Selesai
        </span>
      </div>
      <div className="grid gap-10">
        {missions.map((mission, i) => (
          <MissionCard
            key={mission.id}
            mission={mission}
            index={i}
            status={unlockStatuses[i]}
            provinceId={provinceId}
            totalMissions={missions.length}
          />
        ))}
      </div>
    </div>
  );
}
