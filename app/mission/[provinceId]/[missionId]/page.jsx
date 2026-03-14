"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import { provinces } from "@/data/provinces";
import { badges } from "@/data/badges";
import { useUserStore } from "@/store/useUserStore";
import { useUserMission, useCompleteMission } from "@/hooks/useUserMissions";
import {
  ArrowLeft,
  Clock,
  Zap,
  Play,
  ArrowRight,
  RotateCcw,
  X,
} from "lucide-react";
import CelebrationOverlay from "@/components/ui/CelebrationOverlay";
import { fadeIn, zoomIn } from "@/utils/motion-variants";

import CarbonCalculator from "@/components/mission/missions/CarbonCalculator";
import WasteSorting from "@/components/mission/missions/WasteSorting";
import SpeciesQuiz from "@/components/mission/missions/SpeciesQuiz";
import MangroveSimulator from "@/components/mission/missions/MangroveSimulator";
import WaterConservation from "@/components/mission/missions/WaterConservation";
import OceanRescue from "@/components/mission/missions/OceanRescue";
import EcoRoute from "@/components/mission/missions/EcoRoute";

const missionComponents = {
  CarbonCalculator,
  WasteSorting,
  SpeciesQuiz,
  MangroveSimulator,
  WaterConservation,
  OceanRescue,
  EcoRoute,
};

export default function MissionPage() {
  const params = useParams();
  const router = useRouter();

  const provinceId = params?.provinceId;
  const missionId = params?.missionId;

  const { completeMission, isMissionDone, unlockBadge } = useUserStore();
  const { data: mission, isLoading: isMissionLoading } = useUserMission(missionId);
  const completeMissionMutation = useCompleteMission();

  const [phase, setPhase] = useState("briefing");
  const [missionResult, setMissionResult] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [newBadge, setNewBadge] = useState(null);

  const province = provinces.find((p) => p.id === provinceId);

  if (isMissionLoading) {
    return (
      <PageWrapper className="min-h-screen flex items-center justify-center pt-16">
        <p className="text-slate-600 font-medium">Memuat misi...</p>
      </PageWrapper>
    );
  }

  if (!province || !mission) {
    return (
      <PageWrapper className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <p className="text-6xl mb-4">🔍</p>
          <h2 className="font-heading text-xl font-bold text-gray-800 mb-2">
            Misi Tidak Ditemukan
          </h2>
          <Link
            href="/map"
            className="text-primary-600 hover:underline text-sm"
          >
            ← Kembali ke Peta
          </Link>
        </div>
      </PageWrapper>
    );
  }

  const alreadyDone = isMissionDone(missionId, provinceId);
  const MissionComponent = missionComponents[mission.type?.replace(/_/g, "")];

  const handleMissionComplete = async (resultData) => {
    try {
      // Submit to database
      await completeMissionMutation.mutateAsync({
        missionId: mission.id,
        performanceScore: resultData.performancePercent || 80,
      });

      // Update local store
      if (!alreadyDone) {
        completeMission(
          missionId,
          provinceId,
          resultData.earnedXP || mission.xpReward,
          resultData.earnedPoints || mission.pointReward || 0,
          resultData.impactValues || {},
        );

        if (mission.badgeReward?.id) {
          const wasNew = unlockBadge(mission.badgeReward.id);
          if (wasNew) {
            setNewBadge(mission.badgeReward);
          }
        }
      }

      setMissionResult(resultData);
      setPhase("result");
      setShowCelebration(true);
    } catch (error) {
      console.error("Gagal menyelesaikan misi:", error);
      // Fallback ke local completion jika API gagal
      if (!alreadyDone) {
        completeMission(
          missionId,
          provinceId,
          resultData.earnedXP || mission.xpReward,
          resultData.earnedPoints || mission.pointReward || 0,
          resultData.impactValues || {},
        );
      }
      setMissionResult(resultData);
      setPhase("result");
      setShowCelebration(true);
    }
  };

  const getThemeBg = () => {
    switch (mission.category) {
      case "WASTE":
        return "bg-orange-50";
      case "WATER":
        return "bg-blue-50";
      case "BIODIVERSITY":
        return "bg-emerald-50";
      default:
        return "bg-slate-50";
    }
  };

  const getMissionColor = () => {
    switch (mission.category) {
      case "WASTE":
        return "from-orange-400 to-red-500";
      case "WATER":
        return "from-sky-400 to-blue-500";
      case "BIODIVERSITY":
        return "from-purple-400 to-indigo-500";
      case "OCEAN":
        return "from-blue-500 to-cyan-600";
      case "TRANSPORT":
        return "from-green-400 to-emerald-600";
      case "CLIMATE":
        return "from-orange-400 to-red-500";
      case "COASTAL":
        return "from-blue-400 to-cyan-500";
      default:
        return "from-slate-400 to-slate-600";
    }
  };

  return (
    <PageWrapper
      className={`min-h-screen ${getThemeBg()} pt-16 md:pt-20 pb-24 md:pb-8 transition-colors duration-500`}
    >
      <AnimatePresence mode="wait">
        {phase === "briefing" && (
          <motion.div
            key="briefing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            className="max-w-4xl mx-auto px-4 py-8"
          >
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => router.push(`/province/${provinceId}`)}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-slate-300 shadow-sm">
                  <ArrowLeft size={18} />
                </div>
                <span className="font-medium hidden md:inline">Kembali</span>
              </button>
              <span className="bg-white border border-slate-200 px-4 py-1.5 rounded-full text-sm font-bold text-slate-600 shadow-sm">
                {province.name}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <motion.div
                variants={zoomIn(0.1)}
                initial="hidden"
                animate="visible"
                className="relative group perspective-1000"
              >
                <div
                  className={`absolute inset-0 bg-linear-to-br ${getMissionColor()} opacity-20 blur-3xl rounded-full transform scale-110 group-hover:scale-125 transition-transform duration-700`}
                />
                <div
                  className={`relative w-full aspect-square rounded-[3rem] bg-linear-to-br ${getMissionColor()} flex items-center justify-center text-9xl shadow-2xl shadow-emerald-500/20 ring-8 ring-white/50 backdrop-blur-sm transform group-hover:rotate-3 transition-transform duration-500`}
                >
                  <motion.span
                    animate={{ y: [0, -20, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 4,
                      ease: "easeInOut",
                    }}
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
                <div className="mb-6">
                  <span className="inline-block px-3 py-1 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-lg mb-4">
                    Misi #{missionId}
                  </span>
                  <h1 className="font-heading text-4xl md:text-5xl font-black text-slate-800 mb-4 leading-tight">
                    {mission.title}
                  </h1>
                  <p className="text-xl text-slate-500 font-medium">
                    {mission.subtitle}
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/50 mb-8">
                  <p className="text-slate-600 leading-relaxed text-lg">
                    {mission.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 mb-8">
                  <div className="flex items-center gap-2 bg-amber-50 text-amber-600 border border-amber-100 rounded-xl px-4 py-2 font-bold">
                    <Zap size={18} fill="currentColor" /> +{mission.xpReward} XP
                  </div>
                  <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl px-4 py-2 font-bold">
                    💰 +{mission.pointsReward} Poin
                  </div>
                  <div className="flex items-center gap-2 bg-slate-100 text-slate-600 rounded-xl px-4 py-2 font-medium">
                    <Clock size={18} /> {mission.timeEstimate}
                  </div>
                  {alreadyDone && (
                    <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl px-4 py-2 font-bold">
                      <span className="text-lg">✅</span> Selesai
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setPhase("playing")}
                  className="w-full py-5 bg-slate-900 hover:bg-emerald-600 text-white rounded-2xl font-heading font-bold text-xl shadow-xl shadow-slate-900/20 hover:shadow-emerald-600/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group"
                >
                  <Play size={24} fill="currentColor" />
                  {alreadyDone ? "Mainkan Ulang" : "Mulai Misi"}
                  <ArrowRight
                    size={24}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {phase === "playing" && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-slate-900 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 text-white border-b border-white/10">
              <h2 className="font-bold">{mission.title}</h2>
              <button onClick={() => setPhase("briefing")}>
                <X />
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-white p-6">
              {MissionComponent && (
                <MissionComponent
                  province={province}
                  mission={mission}
                  onComplete={handleMissionComplete}
                  onBack={() => setPhase("briefing")}
                />
              )}
            </div>
          </motion.div>
        )}

        {phase === "result" && missionResult && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto px-4 py-12 text-center"
          >
            <h2 className="text-4xl font-black mb-6">🎉 Misi Selesai!</h2>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  setPhase("briefing");
                  setMissionResult(null);
                }}
                className="flex-1 py-4 bg-white border rounded-2xl font-bold flex items-center justify-center gap-2"
              >
                <RotateCcw size={20} /> Main Lagi
              </button>

              <button
                onClick={() => router.push(`/province/${provinceId}`)}
                className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2"
              >
                Lanjut <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CelebrationOverlay
        show={showCelebration}
        xpEarned={missionResult?.earnedXP || mission?.xpReward}
        pointsEarned={missionResult?.earnedPoints || mission?.pointReward || 0}
        performancePercent={missionResult?.performancePercent}
        badgeEarned={newBadge}
        onClose={() => setShowCelebration(false)}
      />
    </PageWrapper>
  );
}
