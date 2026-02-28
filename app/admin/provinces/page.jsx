"use client";

import React, { useEffect, useState } from "react";
import { Plus, Map, Info, AlertTriangle, Layers } from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import FormModal from "@/components/admin/FormModal";
import EcoSelect from "@/components/ui/EcoSelect";
import { useAdminProvinces } from "@/hooks/admin/useAdminProvinces";

export default function ProvincesPage() {
  const [filters, setFilters] = useState({ page: 1, limit: 10, search: "", region: "ALL", threatLevel: "ALL" });
  const { data: response, isLoading, isError, error } = useAdminProvinces(filters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState(null);

  const provinces = response?.data || [];
  const meta = response?.meta || { total: 0, page: 1, totalPages: 1 };

  const handleEdit = (province) => {
    setSelectedProvince(province);
    setIsModalOpen(true);
  };

  const columns = [
    {
      key: "name",
      label: "Provinsi",
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white border-2 border-black rounded-xl flex items-center justify-center text-xl shadow-[3px_3px_0_#0f0f0f]">
            {row.illustration || "🗺️"}
          </div>
          <p className="font-body font-black text-black">{val}</p>
        </div>
      ),
    },
    {
      key: "region",
      label: "Wilayah",
      render: (val) => (
        <span className="inline-block px-3 py-1 bg-slate-100 border-2 border-dashed border-black rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500">
          {val}
        </span>
      ),
    },
    {
      key: "threatLevel",
      label: "Threat Level",
      render: (val) => <StatusBadge variant={val}>{val}</StatusBadge>,
    },
    {
      key: "missionsCount",
      label: "Misi",
      render: (val) => (
        <div className="flex items-center gap-2">
          <span className="font-display font-black text-black">{val || 0}</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
            Active
          </span>
        </div>
      ),
    },
    {
      key: "completionRate",
      label: "Avg. Completion",
      render: (val) => (
        <div className="flex items-center gap-3 w-32">
          <div className="flex-1 h-3 bg-slate-100 border-2 border-black rounded-full overflow-hidden">
            <div className="h-full bg-mint" style={{ width: `${val || 0}%` }} />
          </div>
          <span className="text-xs font-black">{val || 0}%</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-black uppercase tracking-tight">
            Wilayah & <span className="text-emerald-600">Provinsi</span>
          </h1>
          <p className="font-body font-bold text-slate-500 mt-1">
            Pantau status lingkungan dan kelola data geografis 34 provinsi
            Indonesia.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedProvince(null);
            setIsModalOpen(true);
          }}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-purple text-white border-3 border-black rounded-2xl font-display font-black text-xs uppercase tracking-widest shadow-hard hover:shadow-hard-lg hover:-translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
        >
          <Plus size={20} /> Tambah Provinsi
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
          data={provinces}
          isLoading={isLoading}
          onEdit={handleEdit}
          filterConfigs={[
            { key: "region", label: "Wilayah", options: [{ label: "Semua", value: "ALL" }, { label: "Jawa", value: "Jawa" }, { label: "Sumatera", value: "Sumatera" }, { label: "Kalimantan", value: "Kalimantan" }, { label: "Sulawesi", value: "Sulawesi" }, { label: "Papua", value: "Papua" }] },
            { key: "threatLevel", label: "Tingkat Ancaman", options: [{ label: "Semua", value: "ALL" }, { label: "LOW (Aman)", value: "LOW" }, { label: "MEDIUM (Waspada)", value: "MEDIUM" }, { label: "HIGH (Bahaya)", value: "HIGH" }, { label: "CRITICAL (Kritis)", value: "CRITICAL" }] }
          ]}
        />
      )}

      {/* Edit/Create Province Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          selectedProvince
            ? `Edit Data: ${selectedProvince.name}`
            : "Tambah Provinsi Baru"
        }
        submitLabel={selectedProvince ? "Update Data" : "Tambahkan"}
        onSubmit={(e) => {
          e.preventDefault();
          setIsModalOpen(false);
          alert("Data provinsi berhasil diperbarui!");
        }}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block text-xs font-black uppercase tracking-[0.2em] text-black">
                Nama Provinsi
              </label>
              <div className="relative group">
                <Map
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors"
                />
                <input
                  type="text"
                  defaultValue={selectedProvince?.name}
                  placeholder="Contoh: Jawa Timur"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-black rounded-2xl font-body font-bold text-sm focus:outline-none focus:bg-white focus:shadow-hard transition-all"
                />
              </div>
            </div>
            <div className="space-y-4">
              <label className="block text-xs font-black uppercase tracking-[0.2em] text-black mb-4">
                Threat Level
              </label>
              <EcoSelect
                icon={AlertTriangle}
                value={selectedProvince?.threatLevel || "low"}
                onChange={() => { }}
                options={[
                  { label: "Low (Aman)", value: "low" },
                  { label: "Medium (Terancam)", value: "medium" },
                  { label: "High (Bahaya)", value: "high" },
                  { label: "Critical (Kritis)", value: "critical" }
                ]}
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-black uppercase tracking-[0.2em] text-black">
              Status Ekosistem
            </label>
            <div className="relative group">
              <Layers
                size={18}
                className="absolute left-4 top-4 text-slate-400 group-focus-within:text-black transition-colors"
              />
              <textarea
                rows={3}
                defaultValue={selectedProvince?.description}
                placeholder="Deskripsi singkat kondisi lingkungan di wilayah ini..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-black rounded-2xl font-body font-bold text-sm focus:outline-none focus:bg-white focus:shadow-hard transition-all"
              />
            </div>
          </div>

          <div className="p-5 bg-yellow/10 border-2 border-dashed border-black rounded-3xl">
            <div className="flex gap-4 items-start">
              <div className="p-2 bg-yellow border-2 border-black rounded-xl">
                <Info size={16} className="text-black" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-black mb-1">
                  Tips Admin
                </p>
                <p className="text-xs font-bold text-slate-500 leading-relaxed">
                  Perubahan pada threat level provinsi akan langsung
                  mempengaruhi indikator visual di peta interaktif pengguna
                  utama.
                </p>
              </div>
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  );
}
