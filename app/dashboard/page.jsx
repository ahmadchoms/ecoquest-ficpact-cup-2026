"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useDashboard } from "@/hooks/useDashboard";
import { useUserBadges } from "@/hooks/useUserBadges";
import { IMPACT_LABELS } from "@/utils/constants";
import XPBar from "@/components/ui/XPBar";
import LevelBadge from "@/components/ui/LevelBadge";
import BadgeCard from "@/components/ui/BadgeCard";
import ImpactCard from "@/components/ui/ImpactCard";
import ShareCard from "@/components/ui/ShareCard";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  Map,
  RotateCcw,
  Award,
  TreePine,
  BarChart3,
  Share2,
  Loader,
} from "lucide-react";
import { staggerContainer, fadeIn, zoomIn } from "@/utils/motion-variants";

import EcoCard from "@/components/design-system/EcoCard";
import EcoBadge from "@/components/design-system/EcoBadge";
import EcoButton from "@/components/design-system/EcoButton";
import PageWrapper from "@/components/layout/PageWrapper";

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboard();
  const { data: allBadges, isLoading: badgesLoading } = useUserBadges();

  // Map hook data to component variables
  const explorerName = data?.name || "Eco Explorer";
  const totalXP = data?.xp || 0;
  const level = data?.level || 1;
  const earnedBadges = data?.badges?.map((badge) => badge.id) || [];
  const completedMissions = Array.from({ length: data?.completedMissions || 0 });
  const exploredProvinces = data?.exploredProvinces || [];

  // Impact data calculated from mission completions
  const impactData = data?.impactData || {
    carbonSaved: 0,
    waterSaved: 0,
    wasteClassified: 0,
    speciesLearned: 0,
    mangroveRestored: 0,
  };

  // XP progress from API
  const xpProgress = data?.xpProgress || {
    current: totalXP % 500,
    total: 500,
    percentage: 0,
  };

  // Tree equivalent and activity history from API
  const impact = {
    treesEquivalent: data?.treesEquivalent || 0,
  };

  const activityHistory = data?.activityHistory || [];

  // Loading state UI
  if (isLoading) {
    return (
      <PageWrapper className="min-h-screen bg-white bg-grid-pattern pt-20 pb-24 font-body flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-black" />
          <p className="font-display font-black text-2xl text-black uppercase">
            Loading Dashboard...
          </p>
        </div>
      </PageWrapper>
    );
  }

  // Error state UI
  if (error) {
    return (
      <PageWrapper className="min-h-screen bg-white bg-grid-pattern pt-20 pb-24 font-body flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white border-3 border-black rounded-3xl p-8 shadow-hard max-w-md">
            <p className="font-display font-black text-3xl text-red-600 uppercase mb-3">
              Oops!
            </p>
            <p className="text-black text-sm mb-6">
              Failed to load dashboard. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 px-4 bg-yellow border-3 border-black rounded-xl shadow-hard hover:bg-orange transition-all font-display font-black uppercase"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  const impactChartData = [
    { name: "Karbon", value: impactData.carbonSaved, color: "#f5e642" },
    { name: "Air", value: impactData.waterSaved, color: "#0ea5e9" },
    { name: "Sampah", value: impactData.wasteClassified, color: "#b5f0c0" },
    { name: "Spesies", value: impactData.speciesLearned, color: "#c9b8ff" },
    { name: "Mangrove", value: impactData.mangroveRestored, color: "#ffcc80" },
  ].filter((d) => d.value > 0);

  return (
    <PageWrapper className="min-h-screen bg-white bg-grid-pattern pt-20 pb-24 font-body">
      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto px-4 py-6 space-y-14"
      >
        <motion.div variants={fadeIn("down", 0.1)}>
          <div className="bg-mint border-3 border-black shadow-hard-lg rounded-4xl overflow-hidden relative">
            <div className="absolute -bottom-20 -right-10 w-64 h-64 bg-yellow rounded-full border-3 border-black opacity-80 pointer-events-none" />
            <div className="absolute top-0 right-10 p-6 opacity-20 text-black pointer-events-none mix-blend-overlay">
              <TreePine size={180} />
            </div>

            <div className="p-8 relative z-10 border-b-3 border-black">
              <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                <motion.div variants={zoomIn(0.2)}>
                  <div className="bg-white rounded-full p-2 border-3 border-black shadow-hard">
                    <LevelBadge level={level} size="lg" />
                  </div>
                </motion.div>

                <div className="flex-1 text-center md:text-left">
                  <h1 className="font-display text-4xl font-black mb-3 text-black uppercase tracking-wide">
                    {explorerName || "Eco Explorer"}
                  </h1>
                  <span className="inline-block bg-white border-2 border-black px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-[2px_2px_0_#0f0f0f]">
                    Level {level} Guardian
                  </span>
                </div>

                <div className="text-center md:text-right bg-white p-4 rounded-2xl border-3 border-black shadow-hard transform rotate-2">
                  <p className="text-5xl font-display font-black text-black leading-none mb-1">
                    {totalXP.toLocaleString()}
                  </p>
                  <p className="text-black text-xs font-bold uppercase tracking-widest">
                    Total XP POINTS
                  </p>
                </div>
              </div>

              <div className="mt-8 bg-white border-3 border-black rounded-2xl p-5 shadow-hard relative overflow-hidden">
                <div className="flex justify-between text-xs text-black font-black uppercase tracking-widest mb-3">
                  <span>Progress Level {level}</span>
                  <span className="bg-yellow px-2 py-0.5 rounded-md border border-black">
                    {xpProgress.current} / {xpProgress.total} XP
                  </span>
                </div>
                <div className="rounded-full border-2 border-black overflow-hidden bg-gray-100">
                  <XPBar
                    current={xpProgress.current}
                    max={xpProgress.total}
                    level={level}
                    showLabel={false}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 divide-x-3 divide-black bg-white relative z-10">
              <div className="p-6 text-center group hover:bg-yellow transition-colors cursor-default">
                <p className="font-display text-4xl font-black text-black group-hover:scale-110 transition-transform">
                  {completedMissions.length}
                </p>
                <p className="text-xs text-black font-bold uppercase mt-2 tracking-wider">
                  Misi Selesai
                </p>
              </div>
              <div className="p-6 text-center group hover:bg-green transition-colors cursor-default">
                <p className="font-display text-4xl font-black text-black group-hover:scale-110 transition-transform">
                  {exploredProvinces.length}
                  <span className="text-xl text-black/40 font-bold ml-1">
                    /34
                  </span>
                </p>
                <p className="text-xs text-black font-bold uppercase mt-2 tracking-wider">
                  Provinsi
                </p>
              </div>
              <div className="p-6 text-center group hover:bg-purple transition-colors cursor-default">
                <p className="font-display text-4xl font-black text-black group-hover:scale-110 transition-transform">
                  {earnedBadges.length}
                </p>
                <p className="text-xs text-black font-bold uppercase mt-2 tracking-wider">
                  Badge
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeIn("up", 0.2)}>
          <h2 className="text-2xl font-display font-black text-black mb-6 flex items-center gap-3 uppercase tracking-wide">
            <div className="p-2 bg-green border-3 border-black rounded-xl shadow-hard">
              <TreePine size={24} className="text-green-800" strokeWidth={3} />
            </div>
            Dampak Lingkunganmu
          </h2>

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
              <div className="bg-white border-3 border-black rounded-4xl p-6 shadow-hard h-full flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink rounded-full blur-3xl opacity-20 pointer-events-none" />

                <h3 className="text-xl font-display font-black text-black mb-6 flex items-center gap-3 uppercase tracking-wide relative z-10">
                  <div className="p-1.5 bg-pink border-2 border-black rounded-lg shadow-[3px_3px_0_#0f0f0f]">
                    <BarChart3
                      size={20}
                      className="text-black"
                      strokeWidth={3}
                    />
                  </div>
                  Statistik Dampak
                </h3>

                <div className="flex-1 min-h-62.5 w-full relative z-10">
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
                        strokeWidth={3}
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
                          fontFamily: "var(--font-body)",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-5xl">🌍</span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-3 mt-6 relative z-10">
                  {impactChartData.map((d, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 border-2 border-black rounded-xl"
                    >
                      <div
                        className="w-3 h-3 rounded-full border-2 border-black shadow-sm"
                        style={{ backgroundColor: d.color }}
                      />
                      <span className="text-xs font-black text-black uppercase tracking-wider">
                        {d.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            variants={fadeIn("up", 0.4)}
            className="flex flex-col gap-10"
          >
            <div>
              <h2 className="text-xl font-display font-black text-black mb-6 flex items-center gap-3 uppercase tracking-wide">
                <div className="p-1.5 bg-yellow border-2 border-black rounded-lg shadow-[3px_3px_0_#0f0f0f]">
                  <Award
                    size={20}
                    className="text-yellow-600"
                    strokeWidth={3}
                  />
                </div>
                Koleksi Badge
              </h2>

              <div className="bg-white border-3 border-black shadow-hard rounded-4xl p-5 grid grid-cols-3 sm:grid-cols-4 gap-4">
                {badgesLoading ? (
                  <div className="col-span-full flex items-center justify-center py-8">
                    <Loader className="w-6 h-6 animate-spin text-black" />
                  </div>
                ) : (
                  <>
                    {(allBadges || []).slice(0, 8).map((badge) => (
                      <BadgeCard
                        key={badge.id}
                        badge={badge}
                        earned={badge.earned}
                      />
                    ))}
                    {allBadges && allBadges.length > 8 && (
                      <div className="flex flex-col items-center justify-center bg-gray-100 border-3 border-dashed border-black rounded-3xl h-full min-h-25">
                        <span className="text-xl font-black text-black/50">
                          +{allBadges.length - 8}
                        </span>
                        <span className="text-[10px] font-bold uppercase text-black/50">
                          Lagi
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-display font-black text-black mb-6 flex items-center gap-3 uppercase tracking-wide">
                <div className="p-1.5 bg-orange border-2 border-black rounded-lg shadow-[3px_3px_0_#0f0f0f]">
                  <Share2
                    size={20}
                    className="text-amber-800"
                    strokeWidth={3}
                  />
                </div>
                Share Dampakmu
              </h2>
              <ShareCard
                explorerName={explorerName}
                level={level}
                totalXP={totalXP}
                earnedBadges={earnedBadges}
                completedMissions={completedMissions.length}
                exploredProvinces={exploredProvinces}
                impactData={impactData}
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={fadeIn("up", 0.5)}
          className="flex flex-col sm:flex-row gap-5 pt-8"
        >
          <Link href="/map" className="flex-1">
            <button className="w-full py-4 px-6 bg-yellow border-3 border-black rounded-2xl shadow-hard hover:bg-orange hover:-translate-y-1 hover:shadow-hard-lg active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 font-display font-black text-black uppercase tracking-widest text-lg">
              <Map size={24} strokeWidth={2.5} /> Jelajahi Peta
            </button>
          </Link>

          <button
            disabled
            title="Reset progress feature coming soon"
            className="px-6 py-4 rounded-2xl bg-gray-300 border-3 border-black shadow-hard flex items-center justify-center gap-2 font-display font-black text-gray-600 uppercase tracking-widest group cursor-not-allowed opacity-60"
          >
            <RotateCcw
              size={20}
              strokeWidth={3}
              className="group-hover:-rotate-180 transition-transform duration-500"
            />
            Reset Progress
          </button>
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
}
