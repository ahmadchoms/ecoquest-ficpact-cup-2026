"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  Award,
  Star,
  Info,
  Image as ImageIcon,
  Flame,
} from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import FormModal from "@/components/admin/FormModal";
import EcoSelect from "@/components/ui/EcoSelect";
import { useAdminBadges } from "@/hooks/admin/useAdminBadges";

export default function BadgesPage() {
  const [filters, setFilters] = useState({ page: 1, limit: 10, search: "", rarity: "ALL" });
  const { data: response, isLoading, isError, error } = useAdminBadges(filters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);

  const badges = response?.data || [];
  const meta = response?.meta || { total: 0, page: 1, totalPages: 1 };

  const handleEdit = (badge) => {
    setSelectedBadge(badge);
    setIsModalOpen(true);
  };

  const columns = [
    {
      key: "name",
      label: "Badge",
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-50 border-2 border-black rounded-xl flex items-center justify-center text-xl shadow-[3px_3px_0_#0f0f0f]">
            {row.icon || "🏅"}
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
      key: "rarity",
      label: "Rarity",
      render: (val) => <StatusBadge variant={val}>{val}</StatusBadge>,
    },
    {
      key: "usersCount",
      label: "Penerima",
      render: (val) => (
        <div className="flex items-center gap-2">
          <Star size={14} className="text-yellow fill-yellow" />
          <span className="font-display font-black text-black">{val || 0}</span>
        </div>
      ),
    },
    {
      key: "description",
      label: "Deskripsi",
      className: "hidden md:table-cell max-w-xs",
      render: (val) => (
        <p className="truncate text-xs text-slate-500 font-bold">{val}</p>
      ),
    },
    {
      key: "actions",
      label: "Highlight",
      render: (_, row) => (
        <div className="flex items-center gap-1">
          {row.rarity === "LEGENDARY" && (
            <Flame size={16} className="text-orange" />
          )}
          <span className="text-[10px] font-black uppercase text-slate-400">
            ID: {row.id}
          </span>
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
            Koleksi <span className="text-emerald-600">Badges</span>
          </h1>
          <p className="font-body font-bold text-slate-500 mt-1">
            Kelola rarietas, kriteria penghargaan, dan desain visual badge
            prestasi.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedBadge(null);
            setIsModalOpen(true);
          }}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-orange/20 text-orange-700 border-3 border-black rounded-2xl font-display font-black text-xs uppercase tracking-widest shadow-hard hover:shadow-hard-lg hover:-translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
        >
          <Plus size={20} /> Tambah Badge
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
          data={badges}
          isLoading={isLoading}
          onEdit={handleEdit}
          filterConfigs={[
            { key: "rarity", label: "Tingkat Kelangkaan", options: [{ label: "Semua", value: "ALL" }, { label: "COMMON", value: "COMMON" }, { label: "UNCOMMON", value: "UNCOMMON" }, { label: "RARE", value: "RARE" }, { label: "EPIC", value: "EPIC" }, { label: "LEGENDARY", value: "LEGENDARY" }] }
          ]}
        />
      )}

      {/* Edit/Create Badge Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          selectedBadge
            ? `Edit Badge: ${selectedBadge.name}`
            : "Desain Badge Baru"
        }
        submitLabel={selectedBadge ? "Update Data" : "Terbitkan Badge"}
        onSubmit={(e) => {
          e.preventDefault();
          setIsModalOpen(false);
          alert("Data badge berhasil disimpan!");
        }}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block text-xs font-black uppercase tracking-[0.2em] text-black">
                Nama Badge
              </label>
              <div className="relative group">
                <Award
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors"
                />
                <input
                  type="text"
                  defaultValue={selectedBadge?.name}
                  placeholder="Contoh: Pahlawan Pesisir"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-black rounded-2xl font-body font-bold text-sm focus:outline-none focus:bg-white focus:shadow-hard transition-all"
                />
              </div>
            </div>
            <div className="space-y-4">
              <label className="block text-xs font-black uppercase tracking-[0.2em] text-black">
                Rarity / Kelangkaan
              </label>
              <EcoSelect
                value={selectedBadge?.rarity || "common"}
                onChange={() => { }}
                options={[
                  { label: "Common", value: "common" },
                  { label: "Uncommon", value: "uncommon" },
                  { label: "Rare", value: "rare" },
                  { label: "Epic", value: "epic" },
                  { label: "Legendary", value: "legendary" }
                ]}
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-black uppercase tracking-[0.2em] text-black">
              Persyaratan (Kriteria)
            </label>
            <textarea
              rows={3}
              defaultValue={selectedBadge?.description}
              placeholder="Jelaskan bagaimana user bisa mendapatkan badge ini..."
              className="w-full px-4 py-3 bg-slate-50 border-2 border-black rounded-2xl font-body font-bold text-sm focus:outline-none focus:bg-white focus:shadow-hard transition-all"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <label className="block text-xs font-black uppercase tracking-[0.2em] text-black">
                Icon Preview (Emoji/ID)
              </label>
              <div className="relative group">
                <ImageIcon
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors"
                />
                <input
                  type="text"
                  defaultValue={selectedBadge?.icon}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-black rounded-2xl font-body font-bold text-sm focus:outline-none focus:bg-white focus:shadow-hard transition-all"
                />
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white border-3 border-black rounded-3xl shadow-hard w-fit">
              <div className="w-16 h-16 bg-slate-50 border-2 border-black rounded-2xl flex items-center justify-center text-3xl">
                {selectedBadge?.icon || "🏅"}
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Preview
                <br />
                Desktop/Mobile
              </div>
            </div>
          </div>

          <div className="p-5 bg-orange/5 border-2 border-dashed border-orange-200 rounded-3xl">
            <div className="flex gap-4 items-start">
              <div className="p-2 bg-orange border-2 border-black rounded-xl text-white shadow-hard">
                <Info size={16} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-black mb-1">
                  Status Award
                </p>
                <p className="text-xs font-bold text-slate-500 leading-relaxed">
                  Badge yang bersifat &apos;Legendary&apos; akan memberikan
                  notifikasi khusus dan efek visual &quot;Sparkle&quot; pada
                  profil pengguna yang memilikinya.
                </p>
              </div>
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  );
}
