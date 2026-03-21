"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import EcoBadge from "@/components/design-system/EcoBadge";
import { useMissions } from "@/hooks/useMissions";
import { difficultyLabel } from "@/utils/formatters";

export default function MissionShowcase() {
  const { data: missionsResponse, isLoading } = useMissions({ limit: 3 });
  
  // Randomize and limit missions to 3
  const missions = React.useMemo(() => {
    const allMissions = missionsResponse?.data || [];
    if (allMissions.length === 0) return [];
    
    // Shuffle array
    const shuffled = [...allMissions].sort(() => Math.random() - 0.5);
    
    // Return only first 3
    return shuffled.slice(0, 3);
  }, [missionsResponse?.data]);
  return (
    <section className="bg-black py-[100px] border-t-[2.5px] border-black relative overflow-hidden">
      <div className="absolute -top-20 -left-20 w-[320px] h-[320px] rounded-full bg-yellow opacity-[0.12] blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-[280px] h-[280px] rounded-full bg-green opacity-[0.1] blur-3xl" />

      <div className="max-w-[1100px] mx-auto px-6 relative">
        <div className="flex justify-between items-end mb-12 gap-2">
          <div>
            <EcoBadge
              variant="neutral"
              className="mb-4 bg-yellow/20 text-yellow border-yellow/40"
            >
              <Zap size={12} /> Misi Populer
            </EcoBadge>
            <h2 className="font-display font-extrabold text-[clamp(32px,4vw,52px)] text-white leading-[1.15]">
              Misi Populer
            </h2>
            <p className="text-[#888] mt-2">
              Dimainkan lebih dari 10.000 kali minggu ini.
            </p>
          </div>
          <Link
            href="/map"
            className="text-yellow font-display font-extrabold flex items-center gap-1.5 text-[15px] hover:underline"
          >
            Lihat Semua <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {isLoading
            ? [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-48 bg-white/5 animate-pulse rounded-[24px] border-3 border-white/10"
                />
              ))
            : missions.map((mission, i) => (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="border-3 border-white/10 bg-[#1a1a1a] rounded-[24px] p-6 hover:border-yellow/50 transition-colors"
                >
                  <div className="w-[52px] h-[52px] rounded-xl mb-4 flex items-center justify-center text-2xl bg-yellow border-2 border-white/20 shadow-[4px_4px_0_rgba(255,255,255,0.1)]">
                    {mission.icon}
                  </div>
                  <h3 className="font-display font-extrabold text-lg text-white mb-2">
                    {mission.title}
                  </h3>
                  <p className="font-body text-[#888] text-[13px] leading-[1.65] mb-4">
                    {mission.description}
                  </p>
                  <div className="flex gap-2 items-center">
                    <EcoBadge variant="yellow" className="text-[11px] h-6 px-2">
                      +{mission.xpReward} XP
                    </EcoBadge>
                    <EcoBadge
                      variant="neutral"
                      className="bg-white/10 text-zinc-300 border-white/10 text-[11px] h-6 px-2"
                    >
                      {difficultyLabel(mission.difficulty.toLowerCase()).text}
                    </EcoBadge>
                  </div>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}
