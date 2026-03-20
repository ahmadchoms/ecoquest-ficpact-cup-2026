"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import StatusCard from "@/components/ui/StatusCard";
import CelebrationOverlay from "@/components/ui/CelebrationOverlay";
import { fadeIn, zoomIn } from "@/utils/motion-variants";
import { useUserStore } from "@/store/useUserStore";
import { useUserMission } from "@/hooks/useUserMissions";
import { useProvince } from "@/hooks/useProvinces";
import { useCompleteMission } from "@/hooks/useUserMissions";

import missionComponents from "@/constants/missionRegistry";
import BriefingPhase from "@/components/mission/phases/BriefingPhase";
import PlayingPhase from "@/components/mission/phases/PlayingPhase";
import ResultPhase from "@/components/mission/phases/ResultPhase";

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
      const response = await completeMissionMutation.mutateAsync({
        missionId: mission.id,
        performanceScore: resultData.performancePercent ?? 80,
      });

      if (!alreadyDone) {
        completeMission(
          missionId,
          provinceId,
          response.earnedXP,
          response.earnedPoints,
          resultData.impactValues ?? {},
        );
        
        if (response.badge?.id) {
          const wasNew = unlockBadge(response.badge.id);
          if (wasNew) setNewBadge(response.badge);
        }
      }

      const missionResultData = {
        ...resultData,
        earnedXP: response.earnedXP,
        earnedPoints: response.earnedPoints,
        isLevelUp: response.isLevelUp,
      };

      setMissionResult(missionResultData);
      setPhase("result");
      setShowCelebration(true);
    } catch (error) {
      console.error("Gagal menyelesaikan misi:", error);
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
        xpEarned={missionResult?.xpEarned}
        pointsEarned={missionResult?.pointsEarned}
        performancePercent={missionResult?.performancePercent}
        badgeEarned={newBadge}
        onClose={() => setShowCelebration(false)}
      />
    </PageWrapper>
  );
}
