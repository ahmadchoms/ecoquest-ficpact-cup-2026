"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import { Trophy, Crown, Sparkles, Medal, Coins } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { useUserRanks, useUserRank } from "@/hooks/useUsers";
import LeaderboardCard from "@/components/leaderboard/LeaderboardCard";

const TrophyScene = dynamic(() => import("@/components/3d/TrophyScene"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-100 border-3 border-black rounded-3xl animate-pulse shadow-hard" />
  ),
});

function LeaderboardSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="bg-gray-50 border-3 border-gray-200 rounded-3xl p-4 h-24 animate-pulse mb-4"
        />
      ))}
    </>
  );
}

export default function LeaderboardPage() {
  const { data: responseData, isLoading, isError } = useUserRanks();
  const { data: userRankData } = useUserRank();

  const {
    email: currentUserEmail,
    explorerName,
    totalXP,
    level,
    coins,
  } = useUserStore();

  const users = responseData?.data || [];
  const shouldShowFallback = !isLoading && (isError || users.length === 0);

  // Use email from userRankData if available (more reliable), otherwise use store
  const authenticatedEmail = userRankData?.data?.email || currentUserEmail;

  // Helper function to check if user is current user
  const isCurrentUserHelper = (userEmail) => {
    if (!authenticatedEmail || !userEmail) return false;
    const result = userEmail.toLowerCase() === authenticatedEmail.toLowerCase();
    return result;
  };

  // Check if current user is in top 10
  const isUserInTop10 = users.some((user) => isCurrentUserHelper(user.email));

  const leaderboardData = shouldShowFallback
    ? [
        {
          id: "me",
          email: currentUserEmail,
          name: explorerName || "Eco Explorer (Anda)",
          xp: totalXP,
          level: level,
          points: coins,
        },
      ]
    : users;

  // Add user's rank at the bottom if not in top 10
  const finalData =
    !isUserInTop10 && userRankData?.data && userRankData.data.rank > 10
      ? [...leaderboardData, userRankData.data]
      : leaderboardData;

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
          {isLoading ? (
            <LeaderboardSkeleton />
          ) : (
            <>
              {finalData.slice(0, 10).map((user, index) => (
                <LeaderboardCard
                  key={user.id || user.email}
                  user={user}
                  index={index}
                  isCurrentUser={isCurrentUserHelper(user.email)}
                />
              ))}
              
              {/* Show separator and user's rank if not in top 10 */}
              {!isUserInTop10 && userRankData?.data && userRankData.data.rank > 10 && (
                <div className="mt-8 pt-6 border-t-3 border-black">
                  <LeaderboardCard
                    user={userRankData.data}
                    index={userRankData.data.rank - 1}
                    isCurrentUser={true}
                    isUserRank={true}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
