"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import PageWrapper from "@/components/layout/PageWrapper";
import { useUserStore } from "@/store/useUserStore";
import { badgeList } from "@/data/badges";
import { IMPACT_LABELS } from "@/utils/constants";
import XPBar from "@/components/ui/XPBar";
import LevelBadge from "@/components/ui/LevelBadge";
import BadgeCard from "@/components/ui/BadgeCard";
import ImpactCard from "@/components/ui/ImpactCard";
import ShareCard from "@/components/ui/ShareCard";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Map, RotateCcw, Award, TreePine } from "lucide-react";
import { staggerContainer, fadeIn, zoomIn } from "@/utils/motion-variants";

// Design System
import EcoCard from "@/components/design-system/EcoCard";
import EcoBadge from "@/components/design-system/EcoBadge";
import EcoButton from "@/components/design-system/EcoButton";

export default function DashboardPage() {
  const {
    explorerName,
    totalXP,
    level,
    earnedBadges,
    completedMissions,
    exploredProvinces,
    impactData,
    getXPProgress,
    getTotalImpactSummary,
    resetProgress,
  } = useUserStore();

  const xpProgress = getXPProgress();
  const impact = getTotalImpactSummary();

  const impactChartData = [
    { name: "Karbon", value: impactData.carbonSaved, color: "#f5e642" },
    { name: "Air", value: impactData.waterSaved, color: "#0ea5e9" },
    { name: "Sampah", value: impactData.wasteClassified, color: "#b5f0c0" },
    { name: "Spesies", value: impactData.speciesLearned, color: "#c9b8ff" },
    { name: "Mangrove", value: impactData.mangroveRestored, color: "#ffcc80" },
  ].filter((d) => d.value > 0);

  return (
    <PageWrapper className="min-h-screen bg-white pt-20 pb-24 font-body">
      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto px-4 py-6 space-y-10"
      >
        {/* Hero */}
        <motion.div variants={fadeIn("down", 0.1)}>
          <EcoCard className="p-0 overflow-hidden bg-mint relative">
            <div className="p-8 relative z-10">
              <div className="absolute top-0 right-0 p-6 opacity-10 text-black">
                <TreePine size={140} />
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                <motion.div variants={zoomIn(0.2)}>
                  <LevelBadge level={level} size="lg" />
                </motion.div>

                <div className="flex-1 text-center md:text-left">
                  <h1 className="font-display text-4xl font-extrabold mb-2 text-black">
                    {explorerName || "Eco Explorer"}
                  </h1>
                  <EcoBadge
                    variant="neutral"
                    className="bg-white/50 border-black/20"
                  >
                    Level {level} Guardian
                  </EcoBadge>
                </div>

                <div className="text-right hidden md:block">
                  <p className="text-5xl font-display font-extrabold text-black">
                    {totalXP.toLocaleString()}
                  </p>
                  <p className="text-black/60 text-xs font-bold uppercase tracking-wider">
                    Total XP Points
                  </p>
                </div>
              </div>

              <div className="mt-8 bg-white border-3 border-black rounded-2xl p-5 shadow-hard">
                <div className="flex justify-between text-xs text-black font-bold uppercase mb-2">
                  <span>Progress Level {level}</span>
                  <span>
                    {xpProgress.xpInCurrentLevel} / {xpProgress.xpToNextLevel}{" "}
                    XP
                  </span>
                </div>
                <XPBar
                  current={xpProgress.xpInCurrentLevel}
                  max={xpProgress.xpToNextLevel}
                  level={level}
                  showLabel={false}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 divide-x-2 divide-black border-t-3 border-black bg-white">
              <div className="p-6 text-center">
                <p className="font-display text-3xl font-extrabold text-black">
                  {completedMissions.length}
                </p>
                <p className="text-xs text-black/50 font-bold uppercase mt-1">
                  Misi Selesai
                </p>
              </div>

              <div className="p-6 text-center">
                <p className="font-display text-3xl font-extrabold text-black">
                  {exploredProvinces.length}
                  <span className="text-lg text-black/30 font-bold">/34</span>
                </p>
                <p className="text-xs text-black/50 font-bold uppercase mt-1">
                  Provinsi
                </p>
              </div>

              <div className="p-6 text-center">
                <p className="font-display text-3xl font-extrabold text-black">
                  {earnedBadges.length}
                </p>
                <p className="text-xs text-black/50 font-bold uppercase mt-1">
                  Badge
                </p>
              </div>
            </div>
          </EcoCard>
        </motion.div>

        {/* Impact */}
        <motion.div variants={fadeIn("up", 0.2)}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-green border-2 border-black flex items-center justify-center text-black shadow-hard">
              <TreePine size={20} />
            </div>
            <h2 className="font-display text-2xl font-extrabold text-black">
              Dampak Lingkunganmu
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {Object.entries(IMPACT_LABELS).map(
              ([key, { icon, label, unit }], i) => (
                <ImpactCard
                  key={key}
                  icon={icon}
                  value={impactData[key] || 0}
                  unit={unit}
                  label={label}
                  delay={i * 0.1}
                />
              ),
            )}

            <ImpactCard
              icon="🌳"
              value={impact.treesEquivalent || 0}
              unit="pohon"
              label="Setara Pohon"
              delay={0.5}
            />
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          variants={fadeIn("up", 0.5)}
          className="flex flex-col sm:flex-row gap-4 pt-8 border-t-3 border-black"
        >
          <Link href="/map" className="flex-1">
            <EcoButton
              variant="secondary"
              size="lg"
              className="w-full justify-center"
            >
              <Map size={20} /> Jelajahi Peta Indonesia
            </EcoButton>
          </Link>

          <button
            onClick={() => {
              if (
                window.confirm(
                  "Yakin ingin reset semua progress? Data tidak bisa dikembalikan.",
                )
              ) {
                resetProgress();
              }
            }}
            className="px-6 py-4 rounded-xl border-3 border-black font-display font-extrabold text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
          >
            <RotateCcw size={18} /> Reset Progress
          </button>
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
}
