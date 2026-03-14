"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import StatusCard from "@/components/ui/StatusCard";
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
  const { provinceId, missionId } = useParams();
  const router = useRouter();

  const { completeMission, isMissionDone, unlockBadge } = useUserStore();
  const { data: mission, isLoading: isMissionLoading } =
    useUserMission(missionId);
  const { data: province, isLoading: isProvinceLoading } =
    useProvince(provinceId);
  const completeMissionMutation = useCompleteMission();

  const [phase, setPhase] = useState("briefing");
  const [missionResult, setMissionResult] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [newBadge, setNewBadge] = useState(null);

  if (isMissionLoading || isProvinceLoading) {
    return <StatusCard emoji="🔍" title="Memuat Misi..." variant="loading" />;
  }

  if (!province || !mission) {
    return (
      <StatusCard
        emoji="🔍"
        title="Misi Tidak Ditemukan"
        variant="error"
        backHref="/map"
        backLabel="Kembali ke Peta"
      />
    );
  }

  const alreadyDone = isMissionDone(missionId, provinceId);
  const MissionComponent = missionComponents[mission.category];

  const handleMissionComplete = async (resultData) => {
    try {
      await completeMissionMutation.mutateAsync({
        missionId: mission.id,
        performanceScore: resultData.performancePercent ?? 80,
      });
    } catch (error) {
      console.error("Gagal menyelesaikan misi:", error);
    } finally {
      if (!alreadyDone) {
        completeMission(
          missionId,
          provinceId,
          resultData.earnedXP ?? mission.xpReward,
          resultData.earnedPoints ?? mission.pointReward ?? 0,
          resultData.impactValues ?? {},
        );
        if (mission.badgeReward?.id) {
          const wasNew = unlockBadge(mission.badgeReward.id);
          if (wasNew) setNewBadge(mission.badgeReward);
        }
      }
      setMissionResult(resultData);
      setPhase("result");
      setShowCelebration(true);
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
    <PageWrapper className="min-h-screen bg-white bg-grid-pattern pt-16 md:pt-20 pb-24 md:pb-8 text-black">
      <AnimatePresence mode="wait">
        {phase === "briefing" && (
          <BriefingPhase
            key="briefing"
            mission={mission}
            province={province}
            alreadyDone={alreadyDone}
            provinceId={provinceId}
            onStart={() => setPhase("playing")}
            router={router}
          />
        )}

        {phase === "playing" && (
          <PlayingPhase
            key="playing"
            mission={mission}
            province={province}
            MissionComponent={MissionComponent}
            onComplete={handleMissionComplete}
            onBack={() => setPhase("briefing")}
          />
        )}

        {phase === "result" && missionResult && (
          <ResultPhase
            key="result"
            mission={mission}
            missionResult={missionResult}
            provinceId={provinceId}
            onReplay={() => {
              setPhase("briefing");
              setMissionResult(null);
            }}
            router={router}
          />
        )}
      </AnimatePresence>

      <CelebrationOverlay
        show={showCelebration}
        xpEarned={missionResult?.earnedXP ?? mission?.xpReward}
        pointsEarned={missionResult?.earnedPoints ?? mission?.pointReward ?? 0}
        performancePercent={missionResult?.performancePercent}
        badgeEarned={newBadge}
        onClose={() => setShowCelebration(false)}
      />
    </PageWrapper>
  );
}
