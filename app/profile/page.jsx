"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import { useDashboard } from "@/hooks/useDashboard";
import { useUserBadges } from "@/hooks/useUserBadges";
import LevelBadge from "@/components/ui/LevelBadge";
import BadgeCard from "@/components/ui/BadgeCard";
import { Calendar, Award, TrendingUp, Settings, Loader } from "lucide-react";

import AnimatedButton from "@/components/ui/AnimatedButton";
import Link from "next/link";
import { useState, useEffect } from "react";
import EditProfileModal from "@/components/ui/EditProfileModal";
import { useUserItems, useUpdateUserItems } from "@/hooks/useUserItems";
import StatusCard from "@/components/ui/StatusCard";

export default function ProfilePage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBannerId, setSelectedBannerId] = useState(null);
  const [selectedBorderId, setSelectedBorderId] = useState(null);

  const { data, isLoading, error } = useDashboard();
  const { data: allBadges, isLoading: badgesLoading } = useUserBadges();
  const { data: itemsData } = useUserItems();

  // Map hook data to component variables
  const explorerName = data?.name || "Explorer";
  const explorerBio = data?.bio || "";
  const explorerImage = data?.profileImage || null;
  const totalXP = data?.xp || 0;
  const level = data?.level || 1;
  const completedMissions = Array.from({
    length: data?.completedMissions || 0,
  });
  const joinedDate = data?.createdAt ? new Date(data.createdAt) : null;
  const activityHistory = data?.activityHistory || [];

  // Get active banner for header background
  const activeBannerId = itemsData?.activeSelection?.bannerId;
  const activeBanner = itemsData?.banners?.find((b) => b.id === activeBannerId);
  const bannerBgStyle = activeBanner?.content
    ? {
        backgroundImage: `url(${activeBanner.content})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : activeBanner?.content
      ? { backgroundColor: activeBanner.content }
      : {};

  // Get active border for avatar
  const activeBorderId = itemsData?.activeSelection?.borderId;
  const activeBorder = itemsData?.borders?.find((b) => b.id === activeBorderId);

  // Check if border content is image URL or color
  const isImageBorder =
    activeBorder?.content &&
    (activeBorder.content.includes("http") ||
      activeBorder.content.includes(".png") ||
      activeBorder.content.includes(".jpg") ||
      activeBorder.content.includes(".webp") ||
      activeBorder.content.includes(".gif"));

  // Sync selected items with active selection when data loads
  useEffect(() => {
    if (itemsData?.activeSelection) {
      setSelectedBannerId(itemsData.activeSelection.bannerId || null);
      setSelectedBorderId(itemsData.activeSelection.borderId || null);
    }
  }, [itemsData?.activeSelection]);

  if (isLoading) {
    return <StatusCard emoji="🪪" title="Memuat Profil..." variant="loading" />;
  }

  if (error) {
    return (
      <StatusCard
        emoji="🪪"
        title="Data Profil Tidak Ditemukan"
        variant="error"
        backHref="/dashboard"
        backLabel="Kembali ke Dashboard"
      />
    );
  }

  return (
    <PageWrapper className="min-h-screen bg-slate-50 bg-grid-pattern pt-20 md:pb-12 pb-24">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header Profile */}
        <div
          className="border-3 border-black shadow-hard-lg rounded-4xl p-8 flex flex-col md:flex-row items-center gap-8 mb-12 relative overflow-hidden transition-all duration-300"
          style={{
            ...bannerBgStyle,
            backgroundColor: bannerBgStyle.backgroundColor || "#d4fce8", // Default bg-mint
          }}
        >
          {/* Dekorasi background bulat */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-yellow rounded-full border-3 border-black shadow-hard opacity-80 pointer-events-none" />

          {/* Avatar Profile */}
          <div className="relative z-10 w-36 h-36">
            {/* BORDER IMAGE - only if it's an image */}
            {isImageBorder && (
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  backgroundImage: `url(${activeBorder.content})`,
                  backgroundSize: "130%",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
            )}

            {/* AVATAR */}
            <div
              className="w-full h-full rounded-full bg-white shadow-hard flex items-center justify-center text-6xl overflow-hidden"
              style={
                !isImageBorder && activeBorder?.content
                  ? {
                      borderWidth: "4px",
                      borderStyle: "solid",
                      borderColor: activeBorder.content,
                    }
                  : {}
              }
            >
              {data?.profileImage ? (
                <img
                  src={data.profileImage}
                  alt={explorerName}
                  className="w-full h-full object-cover"
                />
              ) : (
                "🧑‍🚀"
              )}
            </div>

            {/* LEVEL BADGE */}
            <div className="absolute -bottom-2 -right-2">
              <LevelBadge level={level} size="md" />
            </div>
          </div>

          {/* Info & Stats */}
          <div className="flex-1 text-center md:text-left z-10">
            <h1 className="text-4xl font-display font-black text-black uppercase tracking-wide mb-2">
              {explorerName || "Explorer"}
            </h1>
            <p className="text-sm font-bold text-slate-600 mb-4">
              @{data?.username || "username"}
            </p>
            {explorerBio && (
              <p className="text-black font-medium mb-4 italic text-sm">
                "{explorerBio}"
              </p>
            )}
            <p className="text-black font-medium flex items-center justify-center md:justify-start gap-2 mb-6">
              <Calendar size={18} strokeWidth={2.5} /> Bergabung sejak{" "}
              {joinedDate ? joinedDate.getFullYear() : "2024"}
            </p>

            <div className="flex justify-center md:justify-start gap-4">
              <div className="bg-white border-3 border-black shadow-hard px-6 py-3 rounded-2xl hover:-translate-y-1 hover:shadow-hard-lg transition-transform">
                <p className="text-xs text-black font-bold uppercase tracking-wider mb-1">
                  Total XP
                </p>
                <p className="text-3xl font-display font-black text-black">
                  {totalXP}
                </p>
              </div>
              <div className="bg-white border-3 border-black shadow-hard px-6 py-3 rounded-2xl hover:-translate-y-1 hover:shadow-hard-lg transition-transform">
                <p className="text-xs text-black font-bold uppercase tracking-wider mb-1">
                  Misi
                </p>
                <p className="text-3xl font-display font-black text-black">
                  {completedMissions.length}
                </p>
              </div>
            </div>
          </div>

          {/* Tombol Edit Profil */}
          <div className="z-10">
            <AnimatedButton
              variant="brutal"
              icon={<Settings size={18} />}
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit Profil
            </AnimatedButton>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-display font-black text-black mb-6 flex items-center gap-3 uppercase tracking-wide">
                <div className="p-2 bg-amber-400 border-3 border-black rounded-xl shadow-hard">
                  <Award size={24} className="text-amber-600" strokeWidth={3} />
                </div>
                Koleksi Badge Terbaru
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {badgesLoading ? (
                  <div className="col-span-full flex items-center justify-center py-8">
                    <Loader className="w-6 h-6 animate-spin text-black" />
                  </div>
                ) : (allBadges || []).filter((badge) => badge.earned).length > 0 ? (
                  (allBadges || [])
                    .filter((badge) => badge.earned)
                    .slice(0, 4)
                    .map((badge) => (
                      <BadgeCard
                        key={badge.id}
                        badge={badge}
                        earned={badge.earned}
                      />
                    ))
                ) : (
                  <div className="col-span-full flex items-center justify-center py-8">
                    <p className="text-black font-bold uppercase text-center">
                      Belum ada badge yang diraih
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-display font-black text-black mb-6 flex items-center gap-3 uppercase tracking-wide">
                <div className="p-2 bg-blue-500 border-3 border-black rounded-xl shadow-hard">
                  <TrendingUp
                    size={24}
                    className="text-blue-300"
                    strokeWidth={3}
                  />
                </div>
                Aktivitas Terakhir
              </h2>
              <div className="bg-white rounded-4xl border-3 border-black shadow-hard overflow-hidden">
                {activityHistory.length === 0 ? (
                  <div className="p-8 text-center text-gray-600 font-medium uppercase">
                    Belum ada aktivitas
                  </div>
                ) : (
                  activityHistory.map((item, i) => (
                    <div
                      key={item.id || i}
                      className="p-5 border-b-3 border-black last:border-0 hover:bg-mint transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer"
                    >
                      <div>
                        <p className="font-bold text-black text-lg group-hover:translate-x-1 transition-transform duration-200">
                          {item.action}
                        </p>
                        <p className="text-xs font-bold text-gray-600 mt-1 uppercase tracking-wider">
                          {new Date(item.date).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      {item.xp && (
                        <span className="inline-block text-sm font-black text-black bg-green border-3 border-black px-4 py-1.5 rounded-xl shadow-[3px_3px_0_#0f0f0f] -rotate-3 group-hover:rotate-0 transition-transform">
                          {item.xp}
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-pink rounded-4xl p-7 border-3 border-black shadow-hard relative overflow-hidden group">
              {/* Dekorasi lingkaran ala Brutalism di background */}
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white rounded-full border-3 border-black opacity-60 group-hover:scale-110 transition-transform duration-500" />

              <h3 className="font-display font-black text-black text-2xl uppercase tracking-wide mb-3 relative z-10">
                Statistik Dampak
              </h3>
              <p className="text-black font-medium mb-8 relative z-10">
                Lihat seberapa besar kontribusi nyata dan dampak lingkunganmu di
                halaman Dashboard.
              </p>

              <Link
                href="/dashboard"
                className="relative z-10 block w-full bg-yellow border-3 border-black text-black text-center font-black uppercase tracking-widest py-3.5 px-4 rounded-2xl shadow-hard hover:bg-orange hover:-translate-y-1 hover:shadow-hard-lg active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
              >
                Buka Dashboard →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        explorerName={explorerName}
        explorerBio={explorerBio}
        explorerImage={explorerImage}
        onClose={() => setIsEditModalOpen(false)}
      />
    </PageWrapper>
  );
}
