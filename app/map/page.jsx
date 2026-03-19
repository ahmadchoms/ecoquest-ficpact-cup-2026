"use client";

import { useState, useEffect } from "react"; // Tambah useEffect
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion"; // Tambah AnimatePresence untuk exit animasi
import PageWrapper from "@/components/layout/PageWrapper";
import MapLegend from "@/components/map/MapLegend";
import { useUserStore } from "@/store/useUserStore";
import { useProvinces } from "@/hooks/useProvinces";
import { REGIONS } from "@/utils/constants";
import { ChevronRight, Filter } from "lucide-react";
import XPBar from "@/components/ui/XPBar";
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
  const [mounted, setMounted] = useState(false); // State untuk handle hydration

  const {
    totalXP,
    level,
    exploredProvinces,
    completedMissions,
    getProvinceProgress,
    getXPProgress,
  } = useUserStore();

  const { data: provincesResponse, isLoading } = useProvinces({ limit: 100 });
  const allProvinces = provincesResponse?.data || [];

  const [activeFilter, setActiveFilter] = useState(null);
  const [showMobileCards, setShowMobileCards] = useState(false);

  // Set mounted ke true setelah komponen masuk ke browser
  useEffect(() => {
    setMounted(true);
  }, []);

  const xpProgress = getXPProgress();

  const filteredProvinces = activeFilter
    ? allProvinces.filter((p) => p.region === activeFilter)
    : allProvinces;

  const recommended = getRecommendedMission(
    completedMissions,
    exploredProvinces,
  );

  return (
    <PageWrapper className="min-h-screen bg-gray-50 pt-16 md:pt-20">
      <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] md:h-[calc(100vh-80px)]">
        {/* Map Area */}
        <div className="flex-1 relative z-10">
          <InteractiveMap
            provinces={filteredProvinces}
            allProvinces={allProvinces}
            onProvinceClick={(id) => router.push(`/province/${id}`)}
          />
          <MapLegend />

          {/* Region Filter */}
          <div className="absolute top-3 left-15 z-500">
            <div className="glass rounded-2xl p-2 flex flex-wrap gap-1.5 max-w-xs">
              <button
                onClick={() => setActiveFilter(null)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all
                  ${
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
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all
                    ${
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

          {/* Mobile toggle */}
          <button
            onClick={() => setShowMobileCards(!showMobileCards)}
            className="lg:hidden absolute bottom-24 right-4 z-500 bg-white shadow-lg rounded-full p-3"
          >
            <Filter size={20} className="text-gray-700" />
          </button>
        </div>

        {/* Sidebar (Desktop) */}
        <div className="hidden lg:block w-80 border-l border-gray-200 bg-white overflow-y-auto">
          {/* Bungkus bagian yang menggunakan data store dengan mounted check */}
          {mounted ? (
            <>
              <div className="p-5 border-b border-gray-100">
                <h2 className="font-heading font-bold text-lg text-gray-800 mb-3">
                  📊 Status Explorer
                </h2>

                <XPBar
                  current={xpProgress.xpInCurrentLevel}
                  max={xpProgress.xpToNextLevel}
                  level={level}
                />

                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="text-center">
                    <p className="font-bold text-lg text-primary-600">
                      {exploredProvinces.length}
                    </p>
                    <p className="text-[10px] text-gray-500">Provinsi</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-lg text-primary-600">
                      {completedMissions.length}
                    </p>
                    <p className="text-[10px] text-gray-500">Misi</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-lg text-primary-600">{totalXP}</p>
                    <p className="text-[10px] text-gray-500">Total XP</p>
                  </div>
                </div>
              </div>

              {recommended && (
                <div className="p-5 border-b border-gray-100">
                  <h3 className="font-heading font-semibold text-sm text-gray-700 mb-2">
                    🎯 Misi Selanjutnya
                  </h3>
                  <button
                    onClick={() =>
                      router.push(
                        `/mission/${recommended.province.id}/${recommended.mission.id}`,
                      )
                    }
                    className="w-full text-left bg-linear-to-r from-primary-50 to-secondary-50 rounded-xl p-3 hover:shadow-md transition-all group"
                  >
                    <p className="text-xs text-gray-500">
                      {recommended.province.name}
                    </p>
                    <p className="font-semibold text-sm text-gray-800 flex items-center gap-1">
                      {recommended.mission.icon} {recommended.mission.title}
                      <ChevronRight
                        size={14}
                        className="text-gray-400 group-hover:translate-x-1 transition-transform"
                      />
                    </p>
                  </button>
                </div>
              )}

          <div className="p-5">
            <h3 className="font-heading font-semibold text-sm text-gray-700 mb-3">
              Provinsi
            </h3>
            <div className="space-y-2 max-h-100 overflow-y-auto pr-1">
              {allProvinces.map((prov) => {
                const prog = getProvinceProgress(
                  prov.id,
                  prov.missionsCount || 0,
                );

                    return (
                      <button
                        key={prov.id}
                        onClick={() => router.push(`/province/${prov.id}`)}
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left group"
                      >
                        <span className="text-xl">{prov.illustration}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {prov.name}
                          </p>
                          <div className="w-full h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${prog}%`,
                                backgroundColor:
                                  prog === 100
                                    ? "#22c55e"
                                    : prog > 0
                                      ? "#fbbf24"
                                      : "#ef4444",
                              }}
                            />
                          </div>
                        </div>
                        <ChevronRight
                          size={14}
                          className="text-gray-300 group-hover:text-gray-500"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            /* Skeleton sederhana saat loading hydration */
            <div className="p-5 flex flex-col gap-4">
               <div className="h-6 w-32 bg-gray-100 animate-pulse rounded" />
               <div className="h-4 w-full bg-gray-100 animate-pulse rounded" />
               <div className="grid grid-cols-3 gap-2">
                  <div className="h-12 bg-gray-50 animate-pulse rounded" />
                  <div className="h-12 bg-gray-50 animate-pulse rounded" />
                  <div className="h-12 bg-gray-50 animate-pulse rounded" />
               </div>
            </div>
          )}
        </div>

        {/* Mobile Province Cards */}
        <AnimatePresence>
          {mounted && showMobileCards && (
            <motion.div
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              className="lg:hidden absolute bottom-16 left-0 right-0 z-500 bg-white rounded-t-3xl shadow-2xl max-h-[50vh] overflow-y-auto"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-heading font-bold text-gray-800">
                  Pilih Provinsi
                </h3>
                <button
                  onClick={() => setShowMobileCards(false)}
                  className="text-gray-400 text-sm"
                >
                  Tutup
                </button>
              </div>

            <div className="p-3 grid grid-cols-2 gap-2">
              {filteredProvinces.map((prov) => {
                const prog = getProvinceProgress(
                  prov.id,
                  prov.missionsCount || 0,
                );

                  return (
                    <button
                      key={prov.id}
                      onClick={() => {
                        router.push(`/province/${prov.id}`);
                        setShowMobileCards(false);
                      }}
                      className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-primary-50 transition-colors text-left"
                    >
                      <span className="text-lg">{prov.illustration}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-800 truncate">
                          {prov.name}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {prog}% selesai
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
}