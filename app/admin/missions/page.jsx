"use client";

import React, { useEffect, useState } from "react";
import { Plus, Target, Zap, Tag, Globe, MessageSquare } from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import FormModal from "@/components/admin/FormModal";
import EcoSelect from "@/components/ui/EcoSelect";
import { useAdminMissions } from "@/hooks/admin/useAdminMissions";

export default function MissionsPage() {
  const [filters, setFilters] = useState({ page: 1, limit: 10, search: "", category: "ALL", type: "ALL" });
  const { data: response, isLoading, isError, error } = useAdminMissions(filters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);

  const missions = response?.data || [];
  const meta = response?.meta || { total: 0, page: 1, totalPages: 1 };

  const handleEdit = (mission) => {
    setSelectedMission(mission);
    setIsModalOpen(true);
  };

  const columns = [
    {
      key: "title",
      label: "Misi",
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 border-2 border-black rounded-xl flex items-center justify-center text-lg shadow-[3px_3px_0_#0f0f0f] ${row.color || "bg-yellow"}`}
          >
            {row.icon || "🎯"}
          </div>
          <div>
            <p className="font-body font-black text-black">{val}</p>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              {row.category}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      label: "Tipe",
      render: (val) => (
        <StatusBadge variant={val === "QUIZ" ? "epic" : "common"}>
          {val === "QUIZ" ? "Kuis AI" : "Aksi Nyata"}
        </StatusBadge>
      ),
    },
    {
      key: "xpReward",
      label: "XP Reward",
      render: (val) => (
        <div className="flex items-center gap-1">
          <Zap size={14} className="text-yellow fill-yellow" strokeWidth={3} />
          <span className="font-display font-black text-black">{val}</span>
        </div>
      ),
    },
    {
      key: "completionsCount",
      label: "Peserta",
      render: (val) => (
        <div className="flex items-center gap-2">
          <span className="font-display font-black text-black">{val || 0}</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
            Anak Bangsa
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (val) => (
        <StatusBadge variant={val === "ACTIVE" ? "active" : "inactive"}>
          {val}
        </StatusBadge>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-black uppercase tracking-tight">
            Manajemen <span className="text-emerald-600">Misi</span>
          </h1>
          <p className="font-body font-bold text-slate-500 mt-1">
            Buat tantangan baru, sesuaikan reward XP, dan pantau tingkat
            penyelesaian misi.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedMission(null);
            setIsModalOpen(true);
          }}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-mint border-3 border-black rounded-2xl font-display font-black text-xs uppercase tracking-widest text-black shadow-hard hover:shadow-hard-lg hover:-translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
        >
          <Plus size={20} /> Tambah Misi
        </button>
      </div>

      {isError ? (
        <div className="p-8 bg-red-50 border-3 border-black rounded-3xl text-center">
          <h2 className="text-xl font-display font-black text-red-600 mb-2">Gagal Memuat Data</h2>
          <p className="font-body font-bold text-slate-700">{error?.message || "Terjadi kesalahan saat menghubungi server."}</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={missions}
          isLoading={isLoading}
          onEdit={handleEdit}
          filterConfigs={[
            { key: "category", label: "Kategori Utama", options: [{ label: "Semua", value: "ALL" }, { label: "COASTAL", value: "COASTAL" }, { label: "BIODIVERSITY", value: "BIODIVERSITY" }, { label: "WASTE", value: "WASTE" }, { label: "CLIMATE", value: "CLIMATE" }, { label: "WATER", value: "WATER" }] },
            { key: "type", label: "Tipe Misi", options: [{ label: "Semua", value: "ALL" }, { label: "ACTION/SIMULATION", value: "SIMULATION" }, { label: "QUIZ", value: "QUIZ" }] }
          ]}
        />
      )}

      {/* Edit/Create Mission Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          selectedMission
            ? `Edit Misi: ${selectedMission.title}`
            : "Buat Misi Baru"
        }
        submitLabel={selectedMission ? "Update Misi" : "Terbitkan Misi"}
        size="lg"
        onSubmit={(e) => {
          e.preventDefault();
          setIsModalOpen(false);
          alert("Konfigurasi misi berhasil diperbarui!");
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block text-xs font-black uppercase tracking-[0.2em] text-black">
                Judul Misi
              </label>
              <div className="relative group">
                <Target
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors"
                />
                <input
                  type="text"
                  defaultValue={selectedMission?.title}
                  placeholder="Contoh: Tanam 10 Mangrove"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-black rounded-2xl font-body font-bold text-sm focus:outline-none focus:bg-white focus:shadow-hard transition-all"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-black uppercase tracking-[0.2em] text-black">
                Deskripsi Misi
              </label>
              <textarea
                rows={4}
                defaultValue={selectedMission?.description}
                placeholder="Jelaskan langkah-langkah misi ini..."
                className="w-full px-4 py-3 bg-slate-50 border-2 border-black rounded-2xl font-body font-bold text-sm focus:outline-none focus:bg-white focus:shadow-hard transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <label className="block text-xs font-black uppercase tracking-[0.2em] text-black">
                  Kategori
                </label>
                <EcoSelect
                  icon={Tag}
                  value={selectedMission?.category || "Waste Management"}
                  onChange={() => { }}
                  options={[
                    { label: "Waste Management", value: "Waste Management" },
                    { label: "Energy", value: "Energy" },
                    { label: "Water", value: "Water" },
                    { label: "Biodiversity", value: "Biodiversity" },
                    { label: "Coastal", value: "Coastal" }
                  ]}
                />
              </div>
              <div className="space-y-4">
                <label className="block text-xs font-black uppercase tracking-[0.2em] text-black">
                  XP Reward
                </label>
                <div className="relative group">
                  <Zap
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors"
                  />
                  <input
                    type="number"
                    defaultValue={selectedMission?.xpReward}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-black rounded-2xl font-body font-bold text-sm focus:outline-none focus:bg-white focus:shadow-hard transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-slate-50 border-3 border-black rounded-3xl space-y-4">
              <h4 className="font-display font-black uppercase tracking-tight flex items-center gap-2">
                <Globe size={18} className="text-emerald-600" /> Pengaturan
                Lanjut
              </h4>

              <div className="flex items-center justify-between p-3 bg-white border-2 border-black rounded-xl">
                <span className="text-xs font-black uppercase">
                  Tipe Kuis AI
                </span>
                <input
                  type="checkbox"
                  defaultChecked={selectedMission?.type === "quiz"}
                  className="toggle toggle-success"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-white border-2 border-black rounded-xl">
                <span className="text-xs font-black uppercase">
                  Butuh Verifikasi Foto
                </span>
                <input
                  type="checkbox"
                  defaultChecked={true}
                  className="toggle toggle-info"
                />
              </div>

              <div className="space-y-3">
                <span className="text-xs font-black uppercase block">
                  Target Wilayah
                </span>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-black text-white rounded-lg text-[10px] font-black uppercase">
                    Nasional
                  </span>
                  <span className="px-2 py-1 bg-slate-200 text-slate-500 rounded-lg text-[10px] font-black uppercase hover:bg-black hover:text-white cursor-pointer transition-colors">
                    + Tambah Region
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-purple/10 border-2 border-dashed border-black rounded-3xl">
              <div className="flex gap-4 items-start">
                <div className="p-2 bg-purple border-2 border-black rounded-xl text-white shadow-hard">
                  <MessageSquare size={16} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-black mb-1">
                    Preview Misi
                  </p>
                  <p className="text-[10px] font-bold text-slate-500 leading-relaxed italic">
                    &quot;Misi ini akan muncul sebagai kartu interaktif di
                    dashboard user dengan label &apos;
                    {selectedMission?.category || "Kategori"}&apos; dan reward{" "}
                    {selectedMission?.xpReward || 0} XP.&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  );
}
