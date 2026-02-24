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
  const { provinceId } = useParams();
  const router = useRouter();
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
            to="/map"
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
      {/* Dynamic Header */}
      <div className="relative overflow-hidden bg-slate-900 text-white pb-24 -mt-20 pt-32 rounded-b-[3rem] shadow-2xl z-0">
        <div
          className={`absolute inset-0 bg-linear-to-br from-emerald-900 to-teal-900 opacity-90`}
        />

        {/* Abstract Pattern Overlay */}
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
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#hero-pattern)" />
        </svg>

        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

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
              className="text-8xl md:text-9xl filter drop-shadow-2xl"
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
                  className="font-heading text-4xl md:text-6xl font-black text-white leading-tight"
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
                    className="bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm px-4 py-1.5 rounded-full backdrop-blur-sm transition-colors cursor-default"
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
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-black text-white">
                    {Math.round(progress)}%
                  </span>
                </div>
              </ProgressRing>
              <p className="text-emerald-200 text-xs font-bold uppercase mt-2">
                Explored
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-16 relative z-10 space-y-8">
        {/* Info Cards */}
        <motion.div
          variants={staggerContainer()}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-3 gap-6"
        >
          <motion.div
            variants={fadeIn("up", 0.1)}
            className="md:col-span-2 bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-center"
          >
            <h3 className="font-heading text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Info size={20} className="text-emerald-500" /> Tentang Provinsi
            </h3>
            <p className="text-slate-600 leading-relaxed text-lg">
              {province.description}
            </p>
          </motion.div>

          <motion.div
            variants={fadeIn("up", 0.2)}
            className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6"
          >
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Status Konservasi
              </h3>
              <div
                className={`inline-flex items-center gap-2 ${threat.bg} ${threat.color} text-sm font-bold px-4 py-2 rounded-xl w-full justify-center`}
              >
                <Shield size={16} />
                {threat.text}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Fauna Ikonik
              </h3>
              <div className="flex flex-wrap gap-2">
                {province.species.map((sp, i) => (
                  <span
                    key={i}
                    className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-lg"
                  >
                    {sp}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Fun Fact Ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-linear-to-r from-amber-100 via-yellow-50 to-amber-100 border border-amber-200/50 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4 shadow-sm"
        >
          <div className="bg-amber-400 text-white p-3 rounded-xl shrink-0 shadow-lg shadow-amber-400/40">
            <Star size={24} fill="currentColor" />
          </div>
          <p className="text-amber-900 font-medium text-base md:text-lg">
            <strong>Tahukah kamu?</strong> {province.funFact}
          </p>
        </motion.div>

        {/* Mission Path */}
        <div className="pt-8 pb-12">
          <div className="flex items-center justify-between mb-12">
            <h3 className="font-heading text-3xl font-bold text-slate-800 flex items-center gap-3">
              <span className="bg-emerald-100 text-emerald-600 p-3 rounded-2xl">
                <MapPin size={28} />
              </span>
              Jalur Misi
            </h3>
            <span className="bg-slate-900 text-white font-bold px-6 py-2 rounded-full text-sm shadow-xl shadow-slate-900/20">
              {doneMissions} / {province.missions.length} Selesai
            </span>
          </div>

          <div className="relative pl-0 md:pl-0 space-y-12 md:space-y-0">
            <div className="grid gap-8">
              {province.missions.map((missionId, i) => {
                const mission = missions[missionId];
                const status = unlockStatuses[i];
                const diff = difficultyLabel(mission.difficulty);

                // Determine border and shadow classes based on status
                const cardClasses =
                  status === "completed"
                    ? "border-emerald-200 shadow-xl shadow-emerald-500/10 ring-4 ring-emerald-50"
                    : status === "unlocked"
                      ? "border-blue-200 shadow-xl shadow-blue-500/10 hover:ring-4 hover:ring-blue-50 cursor-pointer"
                      : "border-slate-100 opacity-60 grayscale cursor-not-allowed bg-slate-50";

                return (
                  <motion.div
                    key={missionId}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="relative"
                  >
                    {/* Connector Line (Vertical) */}
                    {i < province.missions.length - 1 && (
                      <div className="absolute left-8 top-24 -bottom-8 w-0.5 bg-slate-200 z-0 hidden md:block ml-0.5 border-l-2 border-dashed border-slate-300" />
                    )}

                    <div
                      className={`relative bg-white rounded-4xl p-6 md:p-8 border-2 transition-all duration-300 transform ${cardClasses}`}
                    >
                      {status !== "locked" ? (
                        <Link
                          href={`/mission/${provinceId}/${missionId}`}
                          className="flex flex-col md:flex-row items-center gap-8 group"
                        >
                          <div className="relative z-10">
                            <div
                              className={`w-20 h-20 rounded-3xl bg-linear-to-br ${mission.color} flex items-center justify-center text-4xl shadow-lg ring-4 ring-white group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}
                            >
                              {mission.icon}
                            </div>
                            {status === "completed" && (
                              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white shadow-md">
                                <CheckCircle2 size={16} />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 text-center md:text-left space-y-3">
                            <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                              <h4 className="font-heading text-2xl font-bold text-slate-800">
                                {mission.title}
                              </h4>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${diff.bg} ${diff.color}`}
                              >
                                {diff.text}
                              </span>
                            </div>
                            <p className="text-slate-500 font-medium text-lg leading-relaxed">
                              {mission.description}
                            </p>

                            <div className="flex items-center justify-center md:justify-start gap-6 text-sm text-slate-400 pt-2 font-medium">
                              <span className="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-3 py-1 rounded-lg">
                                <Star size={16} fill="currentColor" /> +
                                {mission.xpReward} XP
                              </span>
                              <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-lg text-slate-500">
                                <Info size={16} /> {mission.timeEstimate}
                              </span>
                            </div>
                          </div>

                          <div className="shrink-0">
                            <div
                              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300
                                    ${status === "completed" ? "bg-emerald-100 text-emerald-600" : "bg-slate-900 text-white shadow-xl shadow-slate-900/30 group-hover:scale-110"}`}
                            >
                              {status === "completed" ? (
                                <CheckCircle2 size={28} />
                              ) : (
                                <Play
                                  size={24}
                                  fill="currentColor"
                                  className="ml-1"
                                />
                              )}
                            </div>
                          </div>
                        </Link>
                      ) : (
                        <div className="flex flex-col md:flex-row items-center gap-8 opacity-60">
                          <div className="w-20 h-20 rounded-3xl bg-slate-200 flex items-center justify-center text-slate-400 ring-4 ring-white">
                            <Lock size={32} />
                          </div>
                          <div className="flex-1 text-center md:text-left">
                            <h4 className="font-heading text-2xl font-bold text-slate-400 mb-2">
                              {mission.title}
                            </h4>
                            <p className="text-slate-400 font-medium bg-slate-100 px-4 py-2 rounded-xl inline-block">
                              🔒 Selesaikan misi sebelumnya untuk membuka
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
