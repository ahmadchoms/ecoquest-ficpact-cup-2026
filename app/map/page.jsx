"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import MapLegend from "@/components/map/MapLegend";
import MapSidebar from "@/components/map/MapSidebar";
import MobileProvinceCards from "@/components/map/MobileProvinceCards";
import { useUserStore } from "@/store/useUserStore";
import { useProvinces } from "@/hooks/useProvinces";
import { useDashboard } from "@/hooks/useDashboard";
import { REGIONS } from "@/utils/constants";
import { Filter } from "lucide-react";
import { getRecommendedMission } from "@/utils/achievements";

const InteractiveMap = dynamic(
  () => import("@/components/map/InteractiveMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="font-display animate-pulse">Memuat Peta...</p>
      </div>
    ),
  },
);

export default function MapPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [showMobileCards, setShowMobileCards] = useState(false);

  const { data: dashboardData } = useDashboard();
  const setDashboardData = useUserStore((state) => state.setDashboardData);
  const {
    totalXP,
    level,
    exploredProvinces,
    completedMissions,
    getProvinceProgress,
    getXPProgress,
  } = useUserStore();

  const { data: provincesResponse } = useProvinces({ limit: 100 });

  const allProvinces = useMemo(
    () => provincesResponse?.data || [],
    [provincesResponse],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (dashboardData && mounted) {
      setDashboardData({
        explorerName: dashboardData.name || "",
        level: dashboardData.level || 1,
        totalXP: dashboardData.xp || 0,
        coins: dashboardData.points || 0,
        exploredProvinces: dashboardData.exploredProvinces || [],
        impactData: dashboardData.impactData || {
          carbonSaved: 0,
          waterSaved: 0,
          wasteClassified: 0,
          speciesLearned: 0,
          mangroveRestored: 0,
        },
        earnedBadges: dashboardData.badges || [],
      });
    }
  }, [dashboardData, mounted, setDashboardData]);

  const xpProgress = useMemo(
    () => getXPProgress(),
    [getXPProgress, totalXP, level],
  );

  const filteredProvinces = useMemo(() => {
    return activeFilter
      ? allProvinces.filter((p) => p.region === activeFilter)
      : allProvinces;
  }, [allProvinces, activeFilter]);

  const recommended = useMemo(() => {
    return getRecommendedMission(completedMissions, exploredProvinces);
  }, [completedMissions, exploredProvinces]);

  return (
    <PageWrapper className="min-h-screen bg-gray-50 pt-16 md:pt-20">
      <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] md:h-[calc(100vh-80px)]">
        <div className="flex-1 relative z-10">
          <InteractiveMap
            provinces={filteredProvinces}
            allProvinces={allProvinces}
            onProvinceClick={(id) => router.push(`/province/${id}`)}
          />
          <MapLegend />

          <div className="absolute top-3 left-15 z-500">
            <div className="glass rounded-2xl p-2 flex flex-wrap gap-1.5 max-w-xs">
              <button
                onClick={() => setActiveFilter(null)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                  !activeFilter
                    ? "bg-green-500 text-white"
                    : "bg-white/80 text-gray-600 hover:bg-primary-50"
                }`}
              >
                Semua
              </button>
              {REGIONS.map((region) => (
                <button
                  key={region}
                  onClick={() =>
                    setActiveFilter(activeFilter === region ? null : region)
                  }
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                    activeFilter === region
                      ? "bg-green-500 text-white"
                      : "bg-white/80 text-gray-600 hover:bg-primary-50"
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowMobileCards(!showMobileCards)}
            className="lg:hidden absolute bottom-36 right-4 z-500 bg-white shadow-lg rounded-full p-3"
          >
            <Filter size={20} className="text-gray-700" />
          </button>
        </div>

        <div className="hidden lg:block w-80 border-l border-gray-200 bg-white overflow-y-auto">
          <MapSidebar
            mounted={mounted}
            xpProgress={xpProgress}
            level={level}
            exploredProvincesCount={exploredProvinces.length}
            completedMissionsCount={completedMissions.length}
            totalXP={totalXP}
            recommended={recommended}
            allProvinces={allProvinces}
            getProvinceProgress={getProvinceProgress}
          />
        </div>

        <AnimatePresence>
          {mounted && showMobileCards && (
            <MobileProvinceCards
              filteredProvinces={filteredProvinces}
              getProvinceProgress={getProvinceProgress}
              onClose={() => setShowMobileCards(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
}
