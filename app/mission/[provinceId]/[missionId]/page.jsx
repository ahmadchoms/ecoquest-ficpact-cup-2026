"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import { useUserStore } from "@/store/useUserStore";
import { useUserMission, useCompleteMission } from "@/hooks/useUserMissions";
import { useProvince } from "@/hooks/useProvinces";
import {
  ArrowLeft,
  Clock,
  Zap,
  Play,
  ArrowRight,
  RotateCcw,
  X,
  Trophy,
  Star,
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
  CLIMATE: CarbonCalculator,
  WASTE: WasteSorting,
  BIODIVERSITY: SpeciesQuiz,
  COASTAL: MangroveSimulator,
  WATER: WaterConservation,
  OCEAN: OceanRescue,
  TRANSPORT: EcoRoute,
};

const CATEGORY_STYLES = {
  WASTE: { bg: "bg-orange", accent: "bg-orange/20" },
  WATER: { bg: "bg-mint", accent: "bg-mint/20" },
  BIODIVERSITY: { bg: "bg-purple", accent: "bg-purple/20" },
  OCEAN: { bg: "bg-blue-300", accent: "bg-blue-100" },
  TRANSPORT: { bg: "bg-green", accent: "bg-green/20" },
  CLIMATE: { bg: "bg-yellow", accent: "bg-yellow/20" },
  COASTAL: { bg: "bg-pink", accent: "bg-pink/20" },
};

function getMissionStyle(category) {
  return CATEGORY_STYLES[category] ?? { bg: "bg-white", accent: "bg-gray-100" };
}

// ─── Loading Skeleton ───────────────────────────────────────────────────────
function LoadingState() {
  return (
    <PageWrapper className="min-h-screen bg-white bg-grid-pattern flex items-center justify-center px-4 pt-16 md:pt-20">
      <div className="text-center animate-wiggle bg-yellow border-3 border-black shadow-hard p-8 sm:p-10 rounded-4xl max-w-xs w-full">
        <p className="text-6xl sm:text-8xl mb-4 sm:mb-6">🔍</p>
        <h2 className="font-display text-xl sm:text-2xl font-bold text-black">
          Memuat Misi...
        </h2>
      </div>
    </PageWrapper>
  );
}

// ─── Not Found State ─────────────────────────────────────────────────────────
function NotFoundState({ provinceId }) {
  return (
    <PageWrapper className="min-h-screen bg-white bg-grid-pattern flex items-center justify-center px-4 pt-16 md:pt-20">
      <div className="text-center bg-pink border-3 border-black shadow-hard p-8 sm:p-10 rounded-4xl max-w-xs w-full">
        <p className="text-6xl sm:text-8xl mb-4 sm:mb-6 grayscale opacity-80">
          🔍
        </p>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-black mb-4 sm:mb-6">
          Misi Tidak Ditemukan
        </h2>
        <Link
          href="/map"
          className="inline-flex items-center gap-2 bg-white border-3 border-black text-black font-display font-bold px-5 py-3 rounded-2xl shadow-hard hover:-translate-x-1 hover:-translate-y-1 transition-all active:translate-x-0 active:translate-y-0 active:shadow-none text-sm sm:text-base"
        >
          <ArrowLeft size={18} strokeWidth={3} /> Kembali ke Peta
        </Link>
      </div>
    </PageWrapper>
  );
}

// ─── Reward Badge ─────────────────────────────────────────────────────────────
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

// ─── Briefing Phase ──────────────────────────────────────────────────────────
function BriefingPhase({
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
      {/* Top Nav */}
      <div className="flex items-center justify-between mb-6 sm:mb-10">
        <button
          onClick={() => router.push(`/province/${provinceId}`)}
          className="flex items-center gap-1.5 sm:gap-2 bg-white border-3 border-black text-black font-display font-bold px-3 sm:px-4 py-2 rounded-2xl shadow-hard hover:-translate-x-1 hover:-translate-y-1 transition-all active:translate-x-0 active:translate-y-0 active:shadow-none text-sm sm:text-base"
        >
          <ArrowLeft size={16} strokeWidth={3} className="shrink-0" />
          <span className="hidden sm:inline mt-0.5">Kembali</span>
        </button>
        <span className="bg-pink border-3 border-black px-3 sm:px-5 py-1.5 sm:py-2 rounded-2xl text-xs sm:text-sm font-display font-bold text-black shadow-hard uppercase tracking-wider truncate max-w-[140px] sm:max-w-none">
          {province.name}
        </span>
      </div>

      {/* Main Content: stacked on mobile, side-by-side on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 lg:gap-16 items-center">
        {/* Hero Icon */}
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

        {/* Info Panel */}
        <motion.div
          variants={fadeIn("left", 0.2)}
          initial="hidden"
          animate="visible"
        >
          {/* Labels */}
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

          {/* Description Card */}
          <div className="bg-white rounded-3xl sm:rounded-4xl p-4 sm:p-6 md:p-8 border-3 border-black shadow-hard mb-6 sm:mb-8 relative overflow-hidden">
            <div className="absolute top-3 right-3 text-2xl sm:text-3xl opacity-10 animate-wiggle pointer-events-none select-none">
              {mission.icon}
            </div>
            <p className="text-black font-medium leading-relaxed text-sm sm:text-base lg:text-lg">
              {mission.description}
            </p>
          </div>

          {/* Rewards Row — scrollable on tiny screens */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8 md:mb-10">
            <RewardBadge
              icon={
                <Zap
                  size={18}
                  strokeWidth={2.5}
                  fill="currentColor"
                  className="shrink-0"
                />
              }
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

          {/* CTA Button */}
          <button
            onClick={onStart}
            className="w-full py-4 sm:py-5 bg-green hover:bg-yellow text-black border-3 border-black rounded-2xl sm:rounded-3xl font-display font-black text-lg sm:text-xl md:text-2xl uppercase tracking-wider shadow-hard-lg hover:shadow-hard-xl hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all flex items-center justify-center gap-3 group"
          >
            <Play
              size={22}
              strokeWidth={3}
              fill="currentColor"
              className="shrink-0"
            />
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

// ─── Playing Phase ────────────────────────────────────────────────────────────
function PlayingPhase({
  mission,
  province,
  MissionComponent,
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
      {/* Sticky Header */}
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

      {/* Scrollable Content */}
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

// ─── Result Phase ─────────────────────────────────────────────────────────────
function ResultPhase({ mission, missionResult, provinceId, onReplay, router }) {
  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-lg mx-auto px-4 py-8 sm:py-12 text-center"
    >
      {/* Success Card */}
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

        {/* Score summary if available */}
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

      {/* Reward summary */}
      <div className="flex flex-wrap justify-center gap-3 mb-6 sm:mb-8">
        <div className="flex items-center gap-2 bg-yellow border-3 border-black shadow-hard rounded-2xl px-4 py-2.5 font-display font-bold text-base sm:text-lg">
          <Zap size={18} strokeWidth={2.5} fill="currentColor" />+
          {missionResult?.earnedXP || mission?.xpReward} XP
        </div>
        <div className="flex items-center gap-2 bg-green border-3 border-black shadow-hard rounded-2xl px-4 py-2.5 font-display font-bold text-base sm:text-lg">
          💰 +{missionResult?.earnedPoints || mission?.pointReward || 0} Poin
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          onClick={onReplay}
          className="flex-1 py-3.5 sm:py-4 bg-white hover:bg-pink border-3 border-black text-black rounded-2xl sm:rounded-3xl font-display font-bold text-base sm:text-lg md:text-xl uppercase flex items-center justify-center gap-2 sm:gap-3 shadow-hard hover:-translate-x-1 hover:-translate-y-1 transition-all active:translate-x-0 active:translate-y-0 active:shadow-none"
        >
          <RotateCcw size={20} strokeWidth={3} />
          Main Lagi
        </button>
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

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MissionPage() {
  const params = useParams();
  const router = useRouter();

  const provinceId = params?.provinceId;
  const missionId = params?.missionId;

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

  if (isMissionLoading || isProvinceLoading) return <LoadingState />;
  if (!province || !mission) return <NotFoundState provinceId={provinceId} />;

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
