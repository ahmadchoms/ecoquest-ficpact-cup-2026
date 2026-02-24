"use client";

import { motion } from "framer-motion";
import Link from "next/link";
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
    <div className="min-h-screen bg-white pt-20 pb-24 font-body">
      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto px-4 py-6 space-y-10"
      >
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
                    Total XP POINTS
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

            <div className="grid grid-cols-3 divide-x-2 divide-black border-t-3 border-black bg-white">
              <div className="p-6 text-center group hover:bg-yellow transition-colors">
                <p className="font-display text-3xl font-extrabold text-black group-hover:scale-110 transition-transform">
                  {completedMissions.length}
                </p>
                <p className="text-xs text-black/50 font-bold uppercase mt-1">
                  Misi Selesai
                </p>
              </div>
              <div className="p-6 text-center group hover:bg-green transition-colors">
                <p className="font-display text-3xl font-extrabold text-black group-hover:scale-110 transition-transform">
                  {exploredProvinces.length}
                  <span className="text-lg text-black/30 font-bold">/34</span>
                </p>
                <p className="text-xs text-black/50 font-bold uppercase mt-1">
                  Provinsi
                </p>
              </div>
              <div className="p-6 text-center group hover:bg-purple transition-colors">
                <p className="font-display text-3xl font-extrabold text-black group-hover:scale-110 transition-transform">
                  {earnedBadges.length}
                </p>
                <p className="text-xs text-black/50 font-bold uppercase mt-1">
                  Badge
                </p>
              </div>
            </div>
          </EcoCard>
        </motion.div>

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

        <div className="grid lg:grid-cols-2 gap-10">
          {impactChartData.length > 0 && (
            <motion.div variants={fadeIn("up", 0.3)}>
              <EcoCard className="h-full flex flex-col">
                <h3 className="font-display font-extrabold text-xl text-black mb-6">
                  📊 Statistik Dampak
                </h3>
                <div className="flex-1 min-h-62.5 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={impactChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        cornerRadius={4}
                        stroke="black"
                        strokeWidth={2}
                      >
                        {impactChartData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: "16px",
                          border: "3px solid black",
                          boxShadow: "4px 4px 0 black",
                          fontFamily: "var(--font-dm-sans)",
                          fontWeight: "bold",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-4xl">🌍</span>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center gap-3 mt-6">
                  {impactChartData.map((d, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full border border-black"
                        style={{ backgroundColor: d.color }}
                      />
                      <span className="text-xs font-bold text-black uppercase">
                        {d.name}
                      </span>
                    </div>
                  ))}
                </div>
              </EcoCard>
            </motion.div>
          )}

          <motion.div
            variants={fadeIn("up", 0.4)}
            className="flex flex-col gap-10"
          >
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-yellow border-2 border-black flex items-center justify-center text-black shadow-hard">
                  <Award size={20} />
                </div>
                <h2 className="font-display text-2xl font-extrabold text-black">
                  Koleksi Badge
                </h2>
              </div>

              <EcoCard
                variant="flat"
                className="bg-white p-4 grid grid-cols-3 sm:grid-cols-4 gap-3"
              >
                {badgeList.slice(0, 8).map((badge) => (
                  <BadgeCard
                    key={badge.id}
                    badge={badge}
                    earned={earnedBadges.includes(badge.id)}
                  />
                ))}
                {badgeList.length > 8 && (
                  <div className="flex items-center justify-center text-xs text-black/40 font-bold uppercase border-2 border-dashed border-black/20 rounded-2xl h-full min-h-25">
                    +{badgeList.length - 8} lagi
                  </div>
                )}
              </EcoCard>
            </div>

            <div>
              <h2 className="font-display text-2xl font-extrabold text-black mb-6">
                📸 Share Dampakmu
              </h2>
              <ShareCard />
            </div>
          </motion.div>
        </div>

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
    </div>
  );
}
