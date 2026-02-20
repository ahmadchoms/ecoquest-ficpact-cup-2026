"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import { Trophy, Medal, Crown, Sparkles } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

// Next.js dynamic import (better than React.lazy)
const TrophyScene = dynamic(() => import("@/components/3d/TrophyScene"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-100 rounded-xl animate-pulse" />
  ),
});

const mockLeaderboard = [
  { id: 1, name: "Siti Nurbaya", xp: 12500, level: 25, badges: 12 },
  { id: 2, name: "Budi Santoso", xp: 11200, level: 22, badges: 10 },
  { id: 3, name: "Dewi Lestari", xp: 9800, level: 19, badges: 9 },
  { id: 4, name: "Andi Wijaya", xp: 8500, level: 17, badges: 8 },
  { id: 5, name: "Rina Kartika", xp: 7200, level: 14, badges: 6 },
  { id: 6, name: "Eco Explorer (You)", xp: 0, level: 1, badges: 0 },
];

export default function LeaderboardPage() {
  const { explorerName, totalXP, level, earnedBadges } = useUserStore();

  const leaderboardData = mockLeaderboard
    .map((u) =>
      u.id === 6
        ? {
            ...u,
            name: explorerName || "Eco Explorer (You)",
            xp: totalXP,
            level,
            badges: earnedBadges.length,
          }
        : u,
    )
    .sort((a, b) => b.xp - a.xp);

  return (
    <PageWrapper className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10 relative">
          {/* 3D Header */}
          <div className="h-50 w-full mb-6">
            <ErrorBoundary
              fallback={<Trophy className="mx-auto text-amber-500 w-24 h-24" />}
            >
              <Suspense fallback={null}>
                <TrophyScene />
              </Suspense>
            </ErrorBoundary>
          </div>

          <h1 className="text-3xl font-heading font-bold text-slate-800 flex items-center justify-center gap-3">
            <Sparkles className="text-amber-500" size={32} />
            Papan Peringkat
          </h1>
          <p className="text-slate-500 mt-2">
            Para pejuang lingkungan terbaik se-Indonesia
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {leaderboardData.slice(0, 10).map((user, index) => {
            let rankIcon = (
              <span className="text-slate-400 font-bold text-lg w-8 text-center">
                {index + 1}
              </span>
            );
            let bgClass = "hover:bg-slate-50";

            if (index === 0) {
              rankIcon = (
                <Crown className="text-yellow-500 mx-auto" size={24} />
              );
              bgClass = "bg-yellow-50/50 hover:bg-yellow-50";
            } else if (index === 1) {
              rankIcon = <Medal className="text-slate-400 mx-auto" size={24} />;
            } else if (index === 2) {
              rankIcon = <Medal className="text-amber-600 mx-auto" size={24} />;
            }

            const isCurrentUser =
              user.name === (explorerName || "Eco Explorer (You)");

            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-4 p-4 border-b border-slate-50 last:border-0 transition-colors ${bgClass} ${
                  isCurrentUser
                    ? "bg-emerald-50 border-l-4 border-l-emerald-500"
                    : ""
                }`}
              >
                <div className="w-12 shrink-0 text-center">{rankIcon}</div>

                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl shadow-inner">
                  {["🧑‍🚀", "👩‍🌾", "🦸", "🧝‍♀️", "🧙‍♂️"][index % 5]}
                </div>

                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-bold truncate ${
                      isCurrentUser ? "text-emerald-700" : "text-slate-700"
                    }`}
                  >
                    {user.name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>Level {user.level}</span>
                    <span>•</span>
                    <span>{user.badges} Badges</span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-slate-800 text-lg">
                    {user.xp.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-400 uppercase font-medium">
                    XP
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );
}
