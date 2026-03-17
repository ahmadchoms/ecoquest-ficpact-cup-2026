"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Users,
  Target,
  Map as MapIcon,
  Award,
  Activity,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Loader2,
  Calendar,
} from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import FormModal from "@/components/admin/FormModal";
import EcoSelect from "@/components/ui/EcoSelect";
import { useAdmin } from "@/hooks/useAdmin";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function AdminDashboard() {
  const router = useRouter();
  const { stats, activities, isLoading, isError, error } = useAdmin();

  // Modals & Action States
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [expandedActivities, setExpandedActivities] = useState([]);
  const [analyticsPeriod, setAnalyticsPeriod] = useState("Minggu Ini");
  
  // Map period label to API range parameter
  const periodToRange = {
    "Minggu Ini": "7d",
    "Bulan Ini": "30d",
    "Tahun Ini": "365d",
  };
  
  const range = periodToRange[analyticsPeriod] || "7d";
  const { data: analyticsData, isLoading: isAnalyticsLoading } = useAnalytics(range);

  const handleOpenActivities = () => {
    setIsActivityModalOpen(true);
    setExpandedActivities(activities || []);
  };

  // Transform analytics trend data for chart
  const xpDistribution = analyticsData?.trend || [];
  
  // Chart colors
  const COLORS = ["#f5e642", "#b5f0c0", "#c9b8ff", "#ffcc80", "#ffa07a"];

  const uiStats = stats
    ? [
        {
          label: "Total Pengguna",
          value: stats.totalUsers || 0,
          trend: "+12%",
          color: "bg-blue-100 text-blue-600 border-blue-500",
        },
        {
          label: "Misi Aktif",
          value: stats.activeMissions || 0,
          trend: "Stabil",
          color: "bg-emerald-100 text-emerald-600 border-emerald-500",
        },
        {
          label: "XP Regional Harian",
          value: stats.xpToday || 0,
          trend: "+4%",
          color: "bg-yellow text-orange-600 border-orange-500",
        },
        {
          label: "Aktivitas Ekosistem",
          value: stats.totalCompletions || 0,
          trend: "+8%",
          color: "bg-fuchsia-100 text-fuchsia-600 border-fuchsia-500",
        },
      ]
    : [];

  const activityFeeds = activities || [];

  const handleGoToAnalytics = () => {
    router.push("/admin/analytics");
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 bg-slate-100 border-3 border-black/5 rounded-3xl"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-80 bg-slate-100 border-3 border-black/5 rounded-4xl" />
          <div className="h-80 bg-slate-100 border-3 border-black/5 rounded-4xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-red-50 border-3 border-black rounded-3xl m-8">
        <h2 className="text-xl font-display font-black text-red-600 mb-2">
          Gagal Memuat Dashboard
        </h2>
        <p className="font-body font-bold text-slate-700">
          {error?.message || "Terjadi kesalahan saat menghubungi server."}
        </p>
      </div>
    );
  }


  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-black text-black uppercase tracking-tight">
            Ringkasan <span className="text-emerald-600">Sistem</span>
          </h1>
          <p className="font-body font-bold text-slate-500 mt-2">
            Selamat datang kembali, Super Admin. Berikut adalah statistik
            performa EcoQuest hari ini.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black rounded-xl shadow-hard font-black text-xs uppercase tracking-widest text-black">
          <Clock size={16} /> Update terakhir: Baru saja
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {uiStats.map((stat, idx) => {
          const icons = [Users, Target, MapIcon, Award];
          return (
            <AdminCard
              key={idx}
              label={stat.label}
              value={stat.value}
              trend={stat.trend}
              icon={icons[idx]}
              color={stat.color}
              delay={idx * 0.1}
            />
          );
        })}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* XP Distribution Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white border-3 border-black rounded-4xl p-8 shadow-hard relative overflow-hidden flex flex-col"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 relative z-10 gap-4">
            <h2 className="text-xl font-display font-black uppercase tracking-tight flex items-center gap-3">
              <div className="p-2 bg-purple border-2 border-black rounded-lg shadow-[3px_3px_0_#0f0f0f]">
                <TrendingUp size={20} className="text-black" />
              </div>
              Distribusi Level
            </h2>
            <div className="w-40">
              <EcoSelect
                icon={Calendar}
                value={analyticsPeriod}
                onChange={(e) => setAnalyticsPeriod(e.target.value)}
                options={[
                  { label: "Minggu Ini", value: "Minggu Ini" },
                  { label: "Bulan Ini", value: "Bulan Ini" },
                  { label: "Tahun Ini", value: "Tahun Ini" },
                ]}
                size="sm"
              />
            </div>
          </div>

          {isAnalyticsLoading ? (
            <div className="flex-1 w-full min-h-[300px] flex items-center justify-center">
              <Loader2 className="animate-spin text-slate-400" size={32} />
            </div>
          ) : xpDistribution && xpDistribution.length > 0 ? (
            <div className="flex-1 w-full min-h-[300px] relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={xpDistribution}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 900, fill: "#64748b" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 900, fill: "#64748b" }}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(0,0,0,0.05)" }}
                    contentStyle={{
                      borderRadius: "16px",
                      border: "3px solid black",
                      boxShadow: "4px 4px 0 black",
                      fontFamily: "var(--font-body)",
                      fontWeight: 900,
                      textTransform: "uppercase",
                      fontSize: "10px",
                    }}
                  />
                  <Bar dataKey="partisipasi" radius={[8, 8, 0, 0]} barSize={40}>
                    {xpDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="black"
                        strokeWidth={2}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex-1 w-full min-h-[300px] flex items-center justify-center">
              <p className="text-slate-400 font-bold">Tidak ada data tersedia</p>
            </div>
          )}
        </motion.div>

        {/* Recent Activity Timeline */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white border-3 border-black rounded-4xl p-8 shadow-hard flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-display font-black uppercase tracking-tight flex items-center gap-3">
              <div className="p-2 bg-pink border-2 border-black rounded-lg shadow-[3px_3px_0_#0f0f0f]">
                <Activity size={20} className="text-black" />
              </div>
              Aktivitas Terbaru
            </h2>
            <button
              onClick={handleOpenActivities}
              className="text-xs font-black uppercase tracking-widest text-emerald-600 hover:underline decoration-2 underline-offset-4"
            >
              Lihat Semua
            </button>
          </div>

          <div className="flex-1 space-y-6">
            {activityFeeds.map((activity, idx) => (
              <div key={activity.id} className="flex gap-4 relative group">
                {idx !== activityFeeds.length - 1 && (
                  <div className="absolute left-4.75 top-10 -bottom-6 w-0.5 bg-black/10 group-hover:bg-black/20 transition-colors" />
                )}
                <div className="w-10 h-10 shrink-0 bg-slate-50 border-2 border-black rounded-xl flex items-center justify-center shadow-[3px_3px_0_#0f0f0f] relative z-10">
                  <span className="text-sm">👤</span>
                </div>
                <div className="flex-1 pb-6 border-b-2 border-dashed border-black/5 last:border-none">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-body font-black text-sm text-black">
                      {activity.username}
                    </h4>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {new Date(activity.timestamp).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-500">
                    {activity.action}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleOpenActivities}
            className="w-full mt-4 py-3 bg-slate-50 border-2 border-dashed border-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-slate-500 hover:bg-slate-100 hover:text-black hover:border-solid transition-all flex items-center justify-center gap-2 group"
          >
            Muat Aktivitas Lainnya
          </button>
        </motion.div>
      </div>

      {/* Secondary Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-emerald-600 border-3 border-black rounded-4xl p-8 shadow-hard relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/20 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white font-black text-[10px] uppercase tracking-widest mb-4">
                Eco Insight
              </span>
              <h3 className="text-3xl font-display font-black text-white leading-tight max-w-lg mb-4">
                Provinsi{" "}
                <span className="text-yellow underline decoration-4 underline-offset-8">
                  Kalimantan Timur
                </span>{" "}
                Mengalami Kenaikan Partisipasi Misi Sebesar 24% Minggu Ini!
              </h3>
            </div>
            <button
              onClick={handleGoToAnalytics}
              className="w-fit flex items-center gap-2 px-6 py-2.5 bg-yellow border-3 border-black rounded-2xl font-display font-black text-xs uppercase tracking-widest text-black shadow-hard hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              Detail Analitik <ArrowUpRight size={18} />
            </button>
          </div>
        </div>

        <div className="bg-white border-3 border-black rounded-4xl p-8 shadow-hard flex flex-col justify-between group transition-colors">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="w-16 h-16 bg-blue-100 border-3 border-blue-500 rounded-2xl flex items-center justify-center text-2xl text-blue-600 shadow-[3px_3px_0_#3b82f6]">
                <Target size={28} />
              </div>
              <span className="px-3 py-1 bg-slate-100 border-2 border-black rounded-lg text-[10px] font-black uppercase">
                Status Misi
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end border-b-2 border-dashed border-slate-200 pb-3">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Misi Aktif
                  </p>
                  <p className="text-2xl font-display font-black text-black leading-none mt-1">
                    {stats?.activeMissions || 0}
                  </p>
                </div>
                <div className="text-emerald-600 font-black text-sm flex items-center gap-1">
                  <TrendingUp size={14} /> Baru
                </div>
              </div>

              <div className="flex justify-between items-end border-b-2 border-dashed border-slate-200 pb-3">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Tingkat Penyelesaian
                  </p>
                  <p className="text-2xl font-display font-black text-black leading-none mt-1">
                    {stats?.completionRate || 0}%
                  </p>
                </div>
                <div className="text-blue-500 font-black text-sm">Avg.</div>
              </div>

              <div className="flex justify-between items-end pb-1">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Antrean Rilis
                  </p>
                  <p className="text-xl font-display font-black text-slate-700 leading-none mt-1">
                    {stats?.pendingMissionsCount || 0} Draft
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push("/admin/missions")}
            className="w-full mt-6 py-3 bg-white border-3 border-black rounded-2xl font-display font-black text-xs uppercase tracking-widest shadow-[3px_3px_0_#0f0f0f] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
          >
            Kelola Misi
          </button>
        </div>
      </div>

      {/* Full Activity Modal */}
      <FormModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        title="Riwayat Aktivitas Ekosistem"
        submitLabel="Selesai"
        onSubmit={(e) => {
          e.preventDefault();
          setIsActivityModalOpen(false);
        }}
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {expandedActivities.map((act) => (
            <div
              key={act.id}
              className="flex items-center gap-4 p-4 bg-slate-50 border-2 border-black rounded-2xl hover:bg-white hover:shadow-[4px_4px_0_#0f0f0f] transition-all"
            >
              <div className="w-12 h-12 bg-white border-2 border-black rounded-xl flex items-center justify-center text-xl shadow-[3px_3px_0_#0f0f0f] shrink-0">
                {act.action.includes("Badge")
                  ? "🏅"
                  : act.action.includes("Misi")
                    ? "🎯"
                    : "🌱"}
              </div>
              <div className="flex-1">
                <h4 className="font-body font-black text-sm text-black">
                  {act.username}
                </h4>
                <p className="text-xs font-bold text-slate-500">{act.action}</p>
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
                {new Date(act.timestamp).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          ))}
        </div>
      </FormModal>
    </div>
  );
}
