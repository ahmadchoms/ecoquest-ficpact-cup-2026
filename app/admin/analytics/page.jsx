"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Users, Download, Zap, Target } from "lucide-react";
import Link from "next/link";

import EcoSelect from "@/components/ui/EcoSelect";
import { useAnalytics } from "@/hooks/useAnalytics";

import TrendChart from "@/components/admin/analytics/TrendChart";
import RegionalChart from "@/components/admin/analytics/RegionalChart";
import AnalyticsSkeleton from "@/components/admin/analytics/AnalyticsSkeleton";
import KPICard from "@/components/admin/analytics/KPICard";

const RANGE_MAPPING = {
  "Minggu Ini": "7d",
  "Bulan Ini": "30d",
  "Tahun Ini": "365d",
  "Sepanjang Waktu": "all",
};

export default function AnalyticsAdminPage() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState("Minggu Ini");

  const currentRangeParam = RANGE_MAPPING[timeRange];
  const { data, isLoading, isError, error } = useAnalytics(currentRangeParam);

  const handleExport = () => alert("Fitur ekspor akan segera hadir.");

  if (isLoading) return <AnalyticsSkeleton />;
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-red-50 border-3 border-black rounded-3xl m-8">
        <h2 className="text-xl font-display font-black text-red-600 mb-2">
          Gagal Memuat Analitik
        </h2>
        <p className="font-body font-bold text-slate-700">
          {error?.message || "Terjadi kesalahan sistem."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-black text-white font-display font-black uppercase text-xs rounded-xl"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const { summary, trend, regional } = data || {};

  const kpiConfigs = [
    {
      label: "Total Partisipasi",
      value: summary?.totalUsers?.toLocaleString("id-ID") || "0",
      trend: "All time",
      icon: Users,
      color: "bg-yellow",
    },
    {
      label: "XP / Karbon Tereduksi",
      value: summary?.xpEarned?.toLocaleString("id-ID") || "0",
      trend: "Value",
      icon: Zap,
      color: "bg-mint",
    },
    {
      label: "Misi Diselesaikan",
      value: summary?.totalCompletions?.toLocaleString("id-ID") || "0",
      trend: `${summary?.completionRate || 0}% avg rate`,
      icon: Target,
      color: "bg-purple",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 mb-4 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-black transition-colors"
          >
            <ArrowLeft size={16} /> Kembali ke Dashboard
          </Link>
          <h1 className="text-4xl font-display font-black text-black uppercase tracking-tight">
            Deep <span className="text-purple">Analytics</span>
          </h1>
          <p className="font-body font-bold text-slate-500 mt-2">
            Laporan analitik mendalam kinerja partisipasi misi dan dampak
            lingkungan.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-48">
            <EcoSelect
              value={timeRange}
              onChange={(e) =>
                setTimeRange(e?.target !== undefined ? e.target.value : e)
              }
              options={Object.keys(RANGE_MAPPING).map((k) => ({
                label: k,
                value: k,
              }))}
              size="sm"
            />
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-2.5 bg-black text-white border-3 border-black rounded-2xl font-display font-black text-xs uppercase tracking-widest shadow-[3px_3px_0_#b5f0c0] hover:shadow-[3px_3px_0_#f5e642] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <Download size={16} /> Ekspor
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpiConfigs.map((kpi, index) => (
          <KPICard key={index} index={index} {...kpi} />
        ))}
      </div>

      <TrendChart data={trend} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RegionalChart data={regional} />

        <div className="bg-slate-50 border-3 border-black rounded-4xl p-6 shadow-hard flex flex-col justify-between">
          <div>
            <span className="inline-block px-3 py-1 bg-purple text-white border-2 border-black rounded-lg text-[10px] font-black uppercase tracking-widest mb-4">
              Pusat Tindakan
            </span>
            <h3 className="text-2xl font-display font-black leading-tight mb-2">
              Kelola Kampanye Misi
            </h3>
            <p className="text-sm font-body font-bold text-slate-500">
              Analisis region mana yang butuh boost partisipasi dan buat misi
              khusus untuk mengakselerasi tingkat aktivitas.
            </p>
          </div>
          <button
            onClick={() => router.push("/admin/missions")}
            className="w-full mt-6 py-3 bg-white border-3 border-black rounded-2xl font-display font-black text-xs uppercase tracking-widest shadow-[3px_3px_0_#0f0f0f] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
          >
            Buat Misi Khusus Region
          </button>
        </div>
      </div>
    </div>
  );
}
