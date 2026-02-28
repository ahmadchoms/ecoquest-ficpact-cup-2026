"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, Users, Download, Map as MapIcon, BarChart3, Zap, Target } from "lucide-react";
import Link from "next/link";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from "recharts";
import EcoSelect from "@/components/ui/EcoSelect";

const temporalData = [
    { name: "Senin", partisipasi: 1200, emisiDitekan: 400 },
    { name: "Selasa", partisipasi: 1800, emisiDitekan: 600 },
    { name: "Rabu", partisipasi: 1400, emisiDitekan: 550 },
    { name: "Kamis", partisipasi: 2200, emisiDitekan: 800 },
    { name: "Jumat", partisipasi: 2900, emisiDitekan: 1100 },
    { name: "Sabtu", partisipasi: 3800, emisiDitekan: 1600 },
    { name: "Minggu", partisipasi: 4200, emisiDitekan: 2100 },
];

const regionalData = [
    { name: "Jawa", value: 45000 },
    { name: "Sumatera", value: 28000 },
    { name: "Kalimantan", value: 15000 },
    { name: "Sulawesi", value: 12000 },
    { name: "Papua", value: 5000 },
];
const COLORS = ["#b5f0c0", "#f5e642", "#c9b8ff", "#ffcc80", "#ff9999"];

export default function AnalyticsPage() {
    const router = useRouter();
    const [timeRange, setTimeRange] = useState("Minggu Ini");

    return (
        <div className="space-y-8">
            {/* Header & Navigation */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <Link href="/admin" className="inline-flex items-center gap-2 mb-4 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-black transition-colors">
                        <ArrowLeft size={16} /> Kembali ke Dashboard
                    </Link>
                    <h1 className="text-4xl font-display font-black text-black uppercase tracking-tight">
                        Deep <span className="text-purple">Analytics</span>
                    </h1>
                    <p className="font-body font-bold text-slate-500 mt-2">
                        Laporan analitik mendalam kinerja partisipasi misi dan dampak lingkungan.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-48">
                        <EcoSelect
                            value={timeRange}
                            onChange={(val) => setTimeRange(val)}
                            options={[
                                { label: "Minggu Ini", value: "Minggu Ini" },
                                { label: "Bulan Ini", value: "Bulan Ini" },
                                { label: "Tahun Ini", value: "Tahun Ini" },
                                { label: "Sepanjang Waktu", value: "All" }
                            ]}
                            size="sm"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-black text-white border-3 border-black rounded-2xl font-display font-black text-xs uppercase tracking-widest shadow-[3px_3px_0_#b5f0c0] hover:shadow-[3px_3px_0_#f5e642] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all">
                        <Download size={16} /> Ekspor
                    </button>
                </div>
            </div>

            {/* High-Level Impact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Total Partisipasi", value: "124.5K", trend: "+12.5%", icon: Users, color: "bg-yellow" },
                    { label: "Karbon Tereduksi (Ton)", value: "8,430", trend: "+8.2%", icon: Zap, color: "bg-mint" },
                    { label: "Misi Diselesaikan", value: "89.2K", trend: "+15.3%", icon: Target, color: "bg-purple" },
                ].map((kpi, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`p-6 border-3 border-black rounded-3xl shadow-hard relative overflow-hidden group ${kpi.color}`}
                    >
                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2">{kpi.label}</p>
                                <h3 className="text-3xl font-display font-black">{kpi.value}</h3>
                            </div>
                            <div className="w-12 h-12 bg-white border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0_#0f0f0f]">
                                <kpi.icon size={24} className="text-black" />
                            </div>
                        </div>
                        <div className="mt-4 inline-flex items-center gap-1 px-2 py-1 bg-white border-2 border-black rounded-lg text-xs font-black">
                            <TrendingUp size={14} className="text-emerald-600" /> {kpi.trend}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Large Temporal Chart */}
            <div className="bg-white border-3 border-black rounded-4xl p-6 md:p-8 shadow-hard">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-slate-100 border-2 border-black rounded-lg shadow-[2px_2px_0_#0f0f0f]">
                        <BarChart3 size={20} className="text-black" />
                    </div>
                    <h2 className="text-xl font-display font-black uppercase tracking-tight">
                        Tren Partisipasi vs Dampak Lingkungan
                    </h2>
                </div>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={temporalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorPartisipasi" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f5e642" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#f5e642" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorEmisi" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#b5f0c0" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#b5f0c0" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: "#64748b" }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: "#64748b" }} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: "16px", border: "3px solid black", boxShadow: "4px 4px 0 black",
                                    fontFamily: "var(--font-body)", fontWeight: 900, textTransform: "uppercase", fontSize: "10px",
                                }}
                            />
                            <Area type="monotone" dataKey="partisipasi" stroke="#000" strokeWidth={3} fillOpacity={1} fill="url(#colorPartisipasi)" />
                            <Area type="monotone" dataKey="emisiDitekan" stroke="#000" strokeWidth={3} fillOpacity={1} fill="url(#colorEmisi)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Regional Grid View */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white border-3 border-black rounded-4xl p-6 shadow-hard">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-slate-100 border-2 border-black rounded-lg shadow-[2px_2px_0_#0f0f0f]">
                            <MapIcon size={20} className="text-black" />
                        </div>
                        <h2 className="text-lg font-display font-black uppercase tracking-tight">Volume Berdasarkan Wilayah</h2>
                    </div>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={regionalData} margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: "#0f0f0f" }} />
                                <Tooltip cursor={{ fill: "transparent" }}
                                    contentStyle={{
                                        borderRadius: "16px", border: "3px solid black", boxShadow: "4px 4px 0 black",
                                        fontFamily: "var(--font-body)", fontWeight: 900, textTransform: "uppercase", fontSize: "10px",
                                    }}
                                />
                                <Bar dataKey="value" barSize={24} radius={[0, 8, 8, 0]}>
                                    {regionalData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#0f0f0f" strokeWidth={2} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-slate-50 border-3 border-black rounded-4xl p-6 shadow-hard flex flex-col justify-between">
                    <div>
                        <span className="inline-block px-3 py-1 bg-purple text-white border-2 border-black rounded-lg text-[10px] font-black uppercase tracking-widest mb-4">
                            Peringatan
                        </span>
                        <h3 className="text-2xl font-display font-black leading-tight mb-2">Sulawesi Butuh Perhatian Ekstra</h3>
                        <p className="text-sm font-body font-bold text-slate-500">
                            Pertumbuhan partisipasi di wilayah Sulawesi melambat tajam minggu ini. Pertimbangkan untuk mem-boost reward misi di regio ini.
                        </p>
                    </div>
                    <button onClick={() => router.push('/admin/missions')} className="w-full mt-6 py-3 bg-white border-3 border-black rounded-2xl font-display font-black text-xs uppercase tracking-widest shadow-[3px_3px_0_#0f0f0f] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all">
                        Buat Misi Khusus Region
                    </button>
                </div>
            </div>
        </div>
    );
}
