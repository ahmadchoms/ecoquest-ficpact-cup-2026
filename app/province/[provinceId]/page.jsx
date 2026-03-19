"use client";
import { useParams, useRouter } from "next/navigation";
import PageWrapper from "@/components/layout/PageWrapper";
import StatusCard from "@/components/ui/StatusCard";
import { useUserStore } from "@/store/useUserStore";
import { useProvince } from "@/hooks/useProvinces";
import { threatLevelLabel } from "@/utils/formatters";
import { getMissionUnlockStatus } from "@/utils/achievements";

import FunFactBanner from "@/components/province/FunFactBanner";
import ProvinceInfoCards from "@/components/province/InfoCards";
import MissionList from "@/components/province/MissionList";
import ProvinceHero from "@/components/province/Hero";

export default function ProvincePage() {
  const { provinceId } = useParams();
  const router = useRouter();
  const { completedMissions, getProvinceProgress, getProvinceMissionsDone } =
    useUserStore();
  const { data: province, isLoading, isError } = useProvince(provinceId);

  if (isLoading)
    return (
      <StatusCard
        emoji="🏝️"
        title="Memuat Data Provinsi..."
        variant="loading"
      />
    );

  if (isError || !province)
    return (
      <StatusCard
        emoji="🏝️"
        title="Provinsi Tidak Ditemukan"
        variant="error"
        backHref="/map"
      />
    );

  const missionsList = province.missions || [];
  const progress = getProvinceProgress(provinceId, missionsList.length);
  const unlockStatuses = getMissionUnlockStatus(
    missionsList.map((m) => m.id),
    completedMissions,
    provinceId,
  );

  return (
    <PageWrapper className="min-h-screen bg-white bg-grid-pattern pt-16 pb-24 text-black">
      <ProvinceHero
        province={province}
        progress={progress}
        onBack={() => router.push("/map")}
      />

      <div className="md:max-w-5xl mx-auto px-4 -mt-10 relative z-10 space-y-8">
        <ProvinceInfoCards
          province={province}
          threat={threatLevelLabel(province.threatLevel)}
        />

        <FunFactBanner funFact={province.funFact} />

        <MissionList
          missions={missionsList}
          provinceId={provinceId}
          unlockStatuses={unlockStatuses}
          doneCount={getProvinceMissionsDone(provinceId)}
        />
      </div>
    </PageWrapper>
  );
}
