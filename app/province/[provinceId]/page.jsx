"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Info,
  Star,
  Play,
  CheckCircle2,
  Lock,
  Shield,
} from "lucide-react";

import PageWrapper from "@/components/layout/PageWrapper";
import StatusCard from "@/components/ui/StatusCard";
import NeoButton from "@/components/ui/NeoButton";
import { useUserStore } from "@/store/useUserStore";
import { threatLevelLabel, difficultyLabel } from "@/utils/formatters";
import { getMissionUnlockStatus } from "@/utils/achievements";
import ProgressRing from "@/components/ui/ProgressRing";
import { fadeIn, staggerContainer } from "@/utils/motion-variants";
import { useProvince } from "@/hooks/useProvinces";

function HeroPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <pattern
        id="hero-pattern"
        x="0"
        y="0"
        width="40"
        height="40"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M0 40L40 0H20L0 20M40 40V20L20 40"
          stroke="black"
          strokeWidth="2"
          fill="none"
        />
      </pattern>
      <rect width="100%" height="100%" fill="url(#hero-pattern)" />
    </svg>
  );
}

function ProvinceHero({ province, progress, router }) {
  return (
    <div className="relative overflow-hidden bg-mint border-b-[3px] border-black pb-24 -mt-20 pt-32 rounded-b-4xl shadow-hard z-0">
      <HeroPattern />

      <div className="relative z-10 max-w-5xl mx-auto px-4">
        <NeoButton
          onClick={() => router.push("/map")}
          icon={<ArrowLeft size={18} strokeWidth={3} />}
          className="mb-8 w-max"
        >
          Kembali ke Peta
        </NeoButton>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-8xl md:text-9xl bg-white border-3 border-black shadow-hard-xl rounded-4xl p-6 animate-float"
          >
            {province.illustration}
          </motion.div>

          <div className="flex-1 space-y-4">
            <div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="inline-flex items-center gap-2 bg-yellow border-3 border-black shadow-hard px-4 py-1.5 rounded-2xl font-display font-bold text-sm text-black mb-4"
              >
                <MapPin size={18} strokeWidth={2.5} /> {province.region}
              </motion.div>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="font-display text-4xl md:text-7xl font-black text-black leading-tight uppercase tracking-tight"
              >
                {province.name}
              </motion.h1>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-3 pt-2"
            >
              {province.ecosystems.map((eco, i) => (
                <span
                  key={i}
                  className="bg-white border-3 border-black text-black font-display font-bold text-sm px-5 py-2 rounded-2xl shadow-hard hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform cursor-default"
                >
                  {eco}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-yellow border-3 border-black shadow-hard p-6 rounded-4xl text-center min-w-40 transform hover:rotate-3 transition-transform"
          >
            <ProgressRing
              progress={progress}
              size={90}
              color="#0f0f0f"
              strokeWidth={8}
              trackColor="#0f0f0f20"
            >
              <div className="flex flex-col items-center">
                <span className="text-3xl font-display font-black text-black">
                  {Math.round(progress)}%
                </span>
              </div>
            </ProgressRing>
            <p className="text-black text-sm font-display font-bold uppercase mt-3 tracking-widest">
              Explored
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function ProvinceInfoCards({ province, threat }) {
  return (
    <motion.div
      variants={staggerContainer()}
      initial="hidden"
      animate="visible"
      className="grid md:grid-cols-3 gap-6"
    >
      <motion.div
        variants={fadeIn("up", 0.1)}
        className="md:col-span-2 bg-white rounded-4xl p-8 border-3 border-black shadow-hard flex flex-col justify-center"
      >
        <h3 className="font-display text-2xl font-bold text-black mb-4 flex items-center gap-3">
          <span className="bg-green border-3 border-black p-2 rounded-xl shadow-hard">
            <Info size={24} strokeWidth={3} />
          </span>
          Tentang Provinsi
        </h3>
        <p className="text-black font-medium leading-relaxed text-lg border-l-4 border-black pl-4 ml-2">
          {province.description}
        </p>
      </motion.div>

      <motion.div
        variants={fadeIn("up", 0.2)}
        className="bg-purple rounded-4xl p-8 border-3 border-black shadow-hard space-y-8"
      >
        <div>
          <h3 className="font-display text-sm font-bold text-black/70 uppercase tracking-widest mb-3">
            Status Konservasi
          </h3>
          <div
            className={`inline-flex items-center gap-2 ${threat.bg} ${threat.color} font-display font-bold px-4 py-3 rounded-2xl w-full justify-center border-3 border-black shadow-hard`}
          >
            <Shield size={20} strokeWidth={2.5} />
            {threat.text}
          </div>
        </div>
        <div>
          <h3 className="font-display text-sm font-bold text-black/70 uppercase tracking-widest mb-3">
            Fauna Ikonik
          </h3>
          <div className="flex flex-wrap gap-2">
            {province.species.map((sp, i) => (
              <span
                key={i}
                className="bg-white border-[2.5px] border-black text-black font-display font-bold text-xs px-3 py-1.5 rounded-xl shadow-[2px_2px_0px_#0f0f0f]"
              >
                {sp}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function FunFactBanner({ funFact }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-pink border-3 border-black rounded-4xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-hard"
    >
      <div className="bg-yellow border-3 border-black text-black p-4 rounded-2xl shrink-0 shadow-hard animate-wiggle">
        <Star size={32} strokeWidth={2.5} fill="currentColor" />
      </div>
      <p className="text-black font-medium text-lg leading-relaxed">
        <strong className="font-display font-black text-xl block mb-1 uppercase tracking-wide">
          Tahukah kamu?
        </strong>
        {funFact}
      </p>
    </motion.div>
  );
}

function MissionCard({ mission, index, status, provinceId, totalMissions }) {
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
      className="relative"
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
                  <Star size={18} strokeWidth={2.5} fill="currentColor" />{" "}
                  +{mission.xpReward} XP
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

export default function ProvincePage() {
  const { provinceId } = useParams();
  const router = useRouter();
  const { completedMissions, getProvinceProgress, getProvinceMissionsDone } =
    useUserStore();

  const { data: province, isLoading, isError } = useProvince(provinceId);

  if (isLoading) {
    return (
      <StatusCard emoji="🏝️" title="Memuat Data Provinsi..." variant="loading" />
    );
  }

  if (isError || !province) {
    return (
      <StatusCard
        emoji="🏝️"
        title="Provinsi Tidak Ditemukan"
        variant="error"
        backHref="/map"
        backLabel="Kembali ke Peta"
      />
    );
  }

  const missionsList = province.missions || [];
  const progress = getProvinceProgress(provinceId, missionsList.length);
  const doneMissions = getProvinceMissionsDone(provinceId);
  const threat = threatLevelLabel(province.threatLevel);
  const unlockStatuses = getMissionUnlockStatus(
    missionsList.map((m) => m.id),
    completedMissions,
    provinceId,
  );

  return (
    <PageWrapper className="min-h-screen bg-white bg-grid-pattern pt-16 md:pt-20 pb-24 md:pb-12 text-black">
      <ProvinceHero province={province} progress={progress} router={router} />

      <div className="max-w-5xl mx-auto px-4 -mt-10 relative z-10 space-y-8">
        <ProvinceInfoCards province={province} threat={threat} />
        <FunFactBanner funFact={province.funFact} />

        <div className="pt-12 pb-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
            <h3 className="font-display text-4xl font-black text-black flex items-center gap-4 uppercase tracking-tight">
              <span className="bg-green border-3 border-black p-3.5 rounded-2xl shadow-hard">
                <MapPin size={32} strokeWidth={3} />
              </span>
              Jalur Misi
            </h3>
            <span className="bg-yellow border-3 border-black text-black font-display font-bold px-8 py-3 rounded-2xl shadow-hard text-lg">
              {doneMissions} / {missionsList.length} Selesai
            </span>
          </div>

          <div className="relative pl-0 space-y-10">
            <div className="grid gap-10">
              {missionsList.map((mission, i) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  index={i}
                  status={unlockStatuses[i]}
                  provinceId={provinceId}
                  totalMissions={missionsList.length}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
