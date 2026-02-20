"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import { provinces } from "@/data/provinces";
import { missions } from "@/data/missions";
import { badges } from "@/data/badges";
import { useUserStore } from "@/store/useUserStore";
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

const missionComponents = {
  CarbonCalculator,
  WasteSorting,
  SpeciesQuiz,
  MangroveSimulator,
  WaterConservation,
};

export default function MissionPage() {
  const params = useParams();
  const router = useRouter();

  const provinceId = params?.provinceId;
  const missionId = params?.missionId;

  const { completeMission, isMissionDone, unlockBadge } = useUserStore();

  const [phase, setPhase] =
    (useState < "briefing") | "playing" | ("result" > "briefing");
  const [missionResult, setMissionResult] = useState < any > null;
  const [showCelebration, setShowCelebration] = useState(false);
  const [newBadge, setNewBadge] = useState < any > null;

  const province = provinces.find((p) => p.id === provinceId);
  const mission = missions[missionId];

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
  const MissionComponent = missionComponents[mission.component];

  const handleMissionComplete = (resultData) => {
    if (!alreadyDone) {
      completeMission(
        missionId,
        provinceId,
        resultData.earnedXP || mission.xpReward,
        resultData.impactValues || {},
      );

      if (mission.badgeReward) {
        const wasNew = unlockBadge(mission.badgeReward);
        if (wasNew) {
          setNewBadge(badges[mission.badgeReward]);
        }
      }
    }

    setMissionResult(resultData);
    setPhase("result");
    setShowCelebration(true);
  };

  const getThemeBg = () => {
    switch (mission.category) {
      case "waste":
        return "bg-orange-50";
      case "water":
        return "bg-blue-50";
      case "species":
        return "bg-emerald-50";
      default:
        return "bg-slate-50";
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

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <motion.div
                variants={zoomIn(0.1)}
                initial="hidden"
                animate="visible"
              >
                <div
                  className={`w-full aspect-square rounded-[3rem] bg-linear-to-br ${mission.color} flex items-center justify-center text-9xl`}
                >
                  {mission.icon}
                </div>
              </motion.div>

              <motion.div
                variants={fadeIn("left", 0.2)}
                initial="hidden"
                animate="visible"
              >
                <h1 className="font-heading text-4xl font-black text-slate-800 mb-4">
                  {mission.title}
                </h1>
                <p className="text-slate-600 mb-6">{mission.description}</p>

                <button
                  onClick={() => setPhase("playing")}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2"
                >
                  <Play size={20} />
                  {alreadyDone ? "Mainkan Ulang" : "Mulai Misi"}
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
        badgeEarned={newBadge}
        onClose={() => setShowCelebration(false)}
      />
    </PageWrapper>
  );
}
