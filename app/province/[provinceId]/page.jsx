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
import { useUserStore } from "@/store/useUserStore";
import { provinces } from "@/data/provinces";
import { missions } from "@/data/missions";
import { threatLevelLabel, difficultyLabel } from "@/utils/formatters";
import { getMissionUnlockStatus } from "@/utils/achievements";
import ProgressRing from "@/components/ui/ProgressRing";
import { fadeIn, staggerContainer } from "@/utils/motion-variants";

export default function ProvincePage() {
  const params = useParams();
  const router = useRouter();
  const provinceId = params?.provinceId;

  const { completedMissions, getProvinceProgress, getProvinceMissionsDone } =
    useUserStore();

  const province = provinces.find((p) => p.id === provinceId);

  if (!province) {
    return (
      <PageWrapper className="min-h-screen flex items-center justify-center pt-16 md:pt-20">
        <div className="text-center">
          <p className="text-8xl mb-4 grayscale opacity-50">🏝️</p>
          <h2 className="font-heading text-3xl font-bold text-gray-800 mb-2">
            Provinsi Tidak Ditemukan
          </h2>
          <Link
            href="/map"
            className="text-primary-600 hover:underline font-medium"
          >
            ← Kembali ke Peta
          </Link>
        </div>
      </PageWrapper>
    );
  }

  const progress = getProvinceProgress(provinceId, province.missions.length);
  const doneMissions = getProvinceMissionsDone(provinceId);
  const threat = threatLevelLabel(province.threatLevel);
  const unlockStatuses = getMissionUnlockStatus(
    province.missions,
    completedMissions,
    provinceId,
  );

  return (
    <PageWrapper className="min-h-screen bg-slate-50 pt-16 md:pt-20 pb-24 md:pb-12">
      {/* Header */}
      <div className="relative overflow-hidden bg-slate-900 text-white pb-24 -mt-20 pt-32 rounded-b-[3rem] shadow-2xl z-0">
        <div className="absolute inset-0 bg-linear-to-br from-emerald-900 to-teal-900 opacity-90" />

        <div className="relative z-10 max-w-5xl mx-auto px-4">
          <button
            onClick={() => router.push("/map")}
            className="flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors group"
          >
            <div className="bg-white/10 p-2 rounded-full group-hover:bg-white/20 transition-colors">
              <ArrowLeft size={18} />
            </div>
            <span className="font-medium">Kembali ke Peta</span>
          </button>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-8xl md:text-9xl"
            >
              {province.illustration}
            </motion.div>

            <div className="flex-1 space-y-4">
              <div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="flex items-center gap-2 text-emerald-300 font-bold tracking-wider text-sm uppercase mb-2"
                >
                  <MapPin size={16} /> {province.region}
                </motion.div>
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="font-heading text-4xl md:text-6xl font-black text-white"
                >
                  {province.name}
                </motion.h1>
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-2"
              >
                {province.ecosystems.map((eco, i) => (
                  <span
                    key={i}
                    className="bg-white/10 border border-white/10 text-white text-sm px-4 py-1.5 rounded-full"
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
              className="bg-white/10 border border-white/20 backdrop-blur-md p-6 rounded-3xl text-center min-w-35"
            >
              <ProgressRing
                progress={progress}
                size={80}
                color="#34d399"
                strokeWidth={6}
                trackColor="rgba(255,255,255,0.1)"
              >
                <span className="text-2xl font-black text-white">
                  {Math.round(progress)}%
                </span>
              </ProgressRing>
              <p className="text-emerald-200 text-xs font-bold uppercase mt-2">
                Explored
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Missions */}
      <div className="max-w-5xl mx-auto px-4 -mt-16 relative z-10 space-y-12 pb-12">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-3xl font-bold text-slate-800">
            Jalur Misi
          </h3>
          <span className="bg-slate-900 text-white font-bold px-6 py-2 rounded-full text-sm">
            {doneMissions} / {province.missions.length} Selesai
          </span>
        </div>

        <div className="grid gap-8">
          {province.missions.map((missionId, i) => {
            const mission = missions[missionId];
            const status = unlockStatuses[i];
            const diff = difficultyLabel(mission.difficulty);

            const cardClasses =
              status === "completed"
                ? "border-emerald-200 ring-4 ring-emerald-50"
                : status === "unlocked"
                  ? "border-blue-200 hover:ring-4 hover:ring-blue-50 cursor-pointer"
                  : "border-slate-100 opacity-60 grayscale cursor-not-allowed bg-slate-50";

            return (
              <motion.div
                key={missionId}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`bg-white rounded-4xl p-6 md:p-8 border-2 transition-all ${cardClasses}`}
              >
                {status !== "locked" ? (
                  <Link
                    href={`/mission/${provinceId}/${missionId}`}
                    className="flex flex-col md:flex-row items-center gap-8 group"
                  >
                    <div className="w-20 h-20 rounded-3xl bg-linear-to-br flex items-center justify-center text-4xl">
                      {mission.icon}
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h4 className="font-heading text-2xl font-bold text-slate-800">
                          {mission.title}
                        </h4>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${diff.bg} ${diff.color}`}
                        >
                          {diff.text}
                        </span>
                      </div>
                      <p className="text-slate-500 font-medium text-lg">
                        {mission.description}
                      </p>
                    </div>

                    <div className="w-14 h-14 rounded-full flex items-center justify-center bg-slate-900 text-white">
                      {status === "completed" ? (
                        <CheckCircle2 size={28} />
                      ) : (
                        <Play size={24} className="ml-1" />
                      )}
                    </div>
                  </Link>
                ) : (
                  <div className="flex items-center gap-8">
                    <div className="w-20 h-20 rounded-3xl bg-slate-200 flex items-center justify-center text-slate-400">
                      <Lock size={32} />
                    </div>
                    <div>
                      <h4 className="font-heading text-2xl font-bold text-slate-400">
                        {mission.title}
                      </h4>
                      <p className="text-slate-400 font-medium">
                        🔒 Selesaikan misi sebelumnya untuk membuka
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );
}
