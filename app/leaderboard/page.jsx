"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import { Trophy, Crown, Sparkles, Medal } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { useUsers } from "@/hooks/useUsers";

const TrophyScene = dynamic(() => import("@/components/3d/TrophyScene"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-100 border-3 border-black rounded-3xl animate-pulse shadow-hard" />
  ),
});

const AVATARS = ["🧑‍🚀", "👩‍🌾", "🦸", "🧝‍♀️", "🧙‍♂️"];

function getRankConfig(index) {
  if (index === 0)
    return {
      bg: "bg-yellow",
      icon: <Crown size={24} className="text-black" strokeWidth={2.5} />,
    };
  if (index === 1)
    return {
      bg: "bg-white",
      icon: <Medal size={24} className="text-black" strokeWidth={2.5} />,
    };
  if (index === 2)
    return {
      bg: "bg-orange",
      icon: <Medal size={24} className="text-black" strokeWidth={2.5} />,
    };
  return { bg: "bg-pink", icon: `#${index + 1}` };
}

function LeaderboardCard({ user, index, isCurrentUser }) {
  const { bg, icon } = getRankConfig(index);
  const cardBg = isCurrentUser ? "bg-green" : "bg-white";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`${cardBg} border-3 border-black rounded-3xl p-4 shadow-hard hover:-translate-y-1 hover:shadow-hard-lg transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-default`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-14 h-14 ${bg} border-3 border-black rounded-xl flex items-center justify-center font-display font-black text-2xl text-black shadow-[3px_3px_0_#0f0f0f] -rotate-6 group-hover:rotate-0 transition-transform duration-300 shrink-0`}
        >
          {icon}
        </div>
        <div className="w-14 h-14 rounded-full bg-white border-3 border-black flex items-center justify-center text-2xl shadow-inner shrink-0">
          {AVATARS[index % AVATARS.length]}
        </div>
        <div className="min-w-0">
          <h3 className="font-display font-black text-xl text-black uppercase tracking-wide truncate group-hover:translate-x-1 transition-transform">
            {user.name} {isCurrentUser && " ✨"}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-white border-2 border-black px-2 py-0.5 rounded-md text-[10px] font-bold text-black uppercase">
              Level {user.level}
            </span>
            <span className="bg-white border-2 border-black px-2 py-0.5 rounded-md text-[10px] font-bold text-black uppercase">
              {user.badges} Badges
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white border-3 border-black px-4 py-2 rounded-2xl shadow-[3px_3px_0_#0f0f0f] flex items-baseline justify-center sm:justify-end gap-1.5 shrink-0 transform group-hover:rotate-2 transition-transform">
        <span className="font-display font-black text-2xl text-black">
          {user.xp.toLocaleString()}
        </span>
        <span className="text-xs font-black text-black uppercase tracking-widest">
          XP
        </span>
      </div>
    </motion.div>
  );
}

export default function LeaderboardPage() {
  const { data: responseData = [], isLoading } = useUsers({
    limit: 10,
    sortBy: "xp",
    order: "desc",
    role: "USER",
  });

  const users = responseData?.data || [];

  const { explorerName, totalXP, level, earnedBadges } = useUserStore();

  const leaderboardData =
    users.length > 0
      ? users
      : [
          {
            id: "me",
            name: explorerName || "Eco Explorer (Anda)",
            xp: totalXP,
            level,
            badges: earnedBadges.length,
          },
        ];

  return (
    <PageWrapper className="min-h-screen bg-white bg-grid-pattern pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 relative">
        <div className="absolute top-20 left-0 w-64 h-64 bg-yellow rounded-full blur-3xl opacity-30 pointer-events-none" />
        <div className="absolute bottom-40 right-0 w-72 h-72 bg-mint rounded-full blur-3xl opacity-30 pointer-events-none" />

        <div className="text-center mb-12 relative z-10">
          <div className="h-60 w-full mb-8 relative">
            <div className="absolute inset-0 bg-yellow border-3 border-black rounded-4xl shadow-hard transform rotate-1 pointer-events-none" />
            <div className="absolute inset-0 bg-white border-3 border-black rounded-4xl shadow-hard overflow-hidden -rotate-1">
              <ErrorBoundary
                fallback={
                  <Trophy
                    className="mx-auto mt-16 text-black w-24 h-24"
                    strokeWidth={1.5}
                  />
                }
              >
                <Suspense fallback={null}>
                  <TrophyScene />
                </Suspense>
              </ErrorBoundary>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-black text-black uppercase tracking-widest flex flex-wrap items-center justify-center gap-4">
            <div className="p-2 bg-yellow border-3 border-black rounded-xl shadow-hard -rotate-6">
              <Sparkles className="text-black" size={32} strokeWidth={3} />
            </div>
            Papan Peringkat
          </h1>
          <p className="text-black/70 font-bold mt-4 uppercase tracking-widest text-sm bg-white inline-block px-4 py-2 border-2 border-black rounded-full shadow-[2px_2px_0_#0f0f0f]">
            Para pejuang lingkungan terbaik se-Indonesia
          </p>
        </div>

        <div className="space-y-4 relative z-10">
          {leaderboardData.slice(0, 10).map((user, index) => (
            <LeaderboardCard
              key={user.id}
              user={user}
              index={index}
              isCurrentUser={
                user.name === (explorerName || "Eco Explorer (You)")
              }
            />
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
