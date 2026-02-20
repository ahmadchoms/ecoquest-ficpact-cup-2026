"use client";

import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import { useUserStore } from "@/store/useUserStore";
import LevelBadge from "@/components/ui/LevelBadge";
import BadgeCard from "@/components/ui/BadgeCard";
import { badgeList } from "@/data/badges";
import { Calendar, Award, TrendingUp, Settings } from "lucide-react";
import { formatDate } from "@/utils/formatters";
import AnimatedButton from "@/components/ui/AnimatedButton";
import Link from "next/link";

export default function ProfilePage() {
  const {
    explorerName,
    totalXP,
    level,
    earnedBadges,
    completedMissions,
    lastActive,
  } = useUserStore();

  const history = [
    {
      date: "2024-02-15",
      action: "Menyelesaikan misi: Carbon Calculator",
      xp: "+100",
    },
    { date: "2024-02-14", action: "Naik ke Level 2!", xp: "" },
    { date: "2024-02-14", action: "Mendapatkan badge: Early Adopter", xp: "" },
  ];

  return (
    <PageWrapper className="min-h-screen bg-slate-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header Profile */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8 mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center text-6xl shadow-inner">
              🧑‍🚀
            </div>
            <div className="absolute -bottom-2 -right-2">
              <LevelBadge level={level} size="md" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-heading font-bold text-slate-800 mb-2">
              {explorerName || "Explorer"}
            </h1>
            <p className="text-slate-500 flex items-center justify-center md:justify-start gap-2 mb-4">
              <Calendar size={16} /> Bergabung sejak 2024
            </p>

            <div className="flex justify-center md:justify-start gap-4">
              <div className="bg-primary-50 px-4 py-2 rounded-xl border border-primary-100">
                <p className="text-xs text-primary-600 font-bold uppercase">
                  Total XP
                </p>
                <p className="text-2xl font-bold text-primary-700">{totalXP}</p>
              </div>
              <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
                <p className="text-xs text-emerald-600 font-bold uppercase">
                  Misi
                </p>
                <p className="text-2xl font-bold text-emerald-700">
                  {completedMissions.length}
                </p>
              </div>
            </div>
          </div>

          <AnimatedButton variant="secondary" icon={<Settings size={18} />}>
            Edit Profil
          </AnimatedButton>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Award className="text-amber-500" />
                Koleksi Badge Terbaru
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {badgeList.slice(0, 4).map((badge) => (
                  <BadgeCard
                    key={badge.id}
                    badge={badge}
                    earned={earnedBadges.includes(badge.id)}
                  />
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <TrendingUp className="text-blue-500" />
                Aktivitas Terakhir
              </h2>
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                {history.map((item, i) => (
                  <div
                    key={i}
                    className="p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-slate-700">
                        {item.action}
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatDate(item.date)}
                      </p>
                    </div>
                    {item.xp && (
                      <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                        {item.xp}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4">
                Statistik Dampak
              </h3>
              <p className="text-sm text-slate-500">
                Lihat detail dampak lingkunganmu di halaman Dashboard.
              </p>
              <Link
                href="/dashboard"
                className="mt-4 block text-primary-600 text-sm font-medium hover:underline"
              >
                Buka Dashboard →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
