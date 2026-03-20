"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import StatusCard from "@/components/ui/StatusCard";
import CelebrationOverlay from "@/components/ui/CelebrationOverlay";
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
    // Reset previous badge state so old badge does not reappear on next win.
    setNewBadge(null);

    try {
      const response = await completeMissionMutation.mutateAsync({
        missionId: mission.id,
        performanceScore: resultData.performancePercent ?? 80,
      });

      // Axios interceptor unwraps { success, data } → { data: payload, ... }
      const payload = response.data ?? response;

      if (!alreadyDone) {
        completeMission(
          missionId,
          provinceId,
          payload.earnedXP,
          payload.earnedPoints,
          resultData.impactValues ?? {},
        );
        
        if (payload.badge?.id) {
          const wasNew = unlockBadge(payload.badge.id);
          if (wasNew) setNewBadge(payload.badge);
        }
      }

      const missionResultData = {
        ...resultData,
        earnedXP: payload.earnedXP,
        earnedPoints: payload.earnedPoints,
        isLevelUp: payload.isLevelUp,
      };

      setMissionResult(missionResultData);
      setPhase("result");
      setShowCelebration(true);
    } catch (error) {
      const isAlreadyDone = error?.message?.includes("sudah menyelesaikan");

      if (isAlreadyDone) {
        // Misi sudah pernah selesai — hitung reward lokal dan tetap tampilkan result
        const perfScore = Math.max(0.1, Math.min(1.0, (resultData.performancePercent ?? 80) / 100));
        const localXP = Math.max(Math.round((mission?.xpReward || 0) * perfScore), 10);
        const localPoints = Math.max(Math.round((mission?.pointsReward || mission?.pointReward || 0) * perfScore), 5);

        setMissionResult({
          ...resultData,
          earnedXP: localXP,
          earnedPoints: localPoints,
          isLevelUp: false,
        });
        setPhase("result");
        // Jangan tampilkan celebration untuk replay misi yang sudah selesai
      } else {
        console.error("Gagal menyelesaikan misi:", error);
      }
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
            alreadyDone={alreadyDone}
            onReplay={() => {
              setPhase("briefing");
              setMissionResult(null);
              setNewBadge(null);
            }}
            router={router}
          />
        )}
      </AnimatePresence>

      <CelebrationOverlay
        show={showCelebration}
        xpEarned={missionResult?.earnedXP}
        pointsEarned={missionResult?.earnedPoints}
        performancePercent={missionResult?.performancePercent}
        badgeEarned={newBadge}
        onClose={() => setShowCelebration(false)}
      />
    </PageWrapper>
  );
}
