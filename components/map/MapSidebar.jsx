"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import XPBar from "@/components/ui/XPBar";

export default function MapSidebar({
  mounted,
  xpProgress,
  level,
  exploredProvincesCount,
  completedMissionsCount,
  totalXP,
  recommended,
  allProvinces,
  getProvinceProgress,
}) {
  const router = useRouter();

  if (!mounted) {
    return (
      <div className="p-5 flex flex-col gap-4">
        <div className="h-6 w-32 bg-gray-100 animate-pulse rounded" />
        <div className="h-4 w-full bg-gray-100 animate-pulse rounded" />
        <div className="grid grid-cols-3 gap-2">
          <div className="h-12 bg-gray-50 animate-pulse rounded" />
          <div className="h-12 bg-gray-50 animate-pulse rounded" />
          <div className="h-12 bg-gray-50 animate-pulse rounded" />
        </div>
      </div>
    );
  }

  return (
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
              {exploredProvincesCount}
            </p>
            <p className="text-[10px] text-gray-500">Provinsi</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg text-primary-600">
              {completedMissionsCount}
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
            <p className="text-xs text-gray-500">{recommended.province.name}</p>
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
            const prog = getProvinceProgress(prov.id, prov.missionsCount || 0);

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
  );
}
