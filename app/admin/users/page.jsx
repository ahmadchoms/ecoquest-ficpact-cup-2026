"use client";

import React, { useEffect, useState } from "react";
import { Plus, User, Mail, Shield, Trash2, Edit } from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import FormModal from "@/components/admin/FormModal";
import LevelBadge from "@/components/ui/LevelBadge";
import EcoSelect from "@/components/ui/EcoSelect";
import { useAdminUsers, useDeleteAdminUser } from "@/hooks/admin/useAdminUsers";

export default function UsersPage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    role: "ALL",
    status: "ALL",
  });
  const { data: response, isLoading, isError, error } = useAdminUsers(filters);
  const deleteMutation = useDeleteAdminUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const users = response?.data || [];
  const meta = response?.meta || { total: 0, page: 1, totalPages: 1 };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (user) => {
    if (
      window.confirm(
        `Hapus pengguna ${user.username}? Tindakan ini tidak bisa dibatalkan.`,
      )
    ) {
      deleteMutation.mutate(user.id);
    }
  };

  const columns = [
    {
      key: "username",
      label: "Pengguna",
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 border-2 border-black rounded-xl flex items-center justify-center font-display font-black text-xs shadow-[3px_3px_0_#0f0f0f]">
            {val.charAt(0)}
          </div>
          <div>
            <p className="font-body font-black text-black">{val}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {row.id}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (val) => <span className="text-slate-500 font-bold">{val}</span>,
    },
    {
      key: "level",
      label: "Level",
      render: (val) => (
        <div className="flex items-center gap-2">
          <LevelBadge level={val} size="xs" />
          <span className="text-xs font-black">Level {val}</span>
        </div>
      ),
    },
    {
      key: "xp",
      label: "Total XP",
      render: (val) => (
        <span className="font-display font-black text-black">
          {val.toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (val) => (
        <StatusBadge variant={val === "ACTIVE" ? "active" : "critical"}>
          {val}
        </StatusBadge>
      ),
    },
    {
      key: "actions",
      label: "Tier",
      render: (_, row) => (
        <StatusBadge
          variant={
            row.level > 20 ? "legendary" : row.level > 10 ? "epic" : "common"
          }
        >
          {row.level > 20 ? "Elite" : row.level > 10 ? "Veteran" : "Rookie"}
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
            Manajemen <span className="text-emerald-600">Pengguna</span>
          </h1>
          <p className="font-body font-bold text-slate-500 mt-1">
            Lihat, kelola, dan pantau aktivitas seluruh explorer EcoQuest.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedUser(null);
            setIsModalOpen(true);
          }}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-yellow border-3 border-black rounded-2xl font-display font-black text-xs uppercase tracking-widest text-black shadow-hard hover:shadow-hard-lg hover:-translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
        >
          <Plus size={20} /> Tambah User
        </button>
      </div>

      {isError ? (
        <div className="p-8 bg-red-50 border-3 border-black rounded-3xl text-center">
          <h2 className="text-xl font-display font-black text-red-600 mb-2">
            Gagal Memuat Data
          </h2>
          <p className="font-body font-bold text-slate-700">
            {error?.message || "Terjadi kesalahan saat menghubungi server."}
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={users}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          filterConfigs={[
            {
              key: "role",
              label: "Hak Akses",
              options: [
                { label: "Semua", value: "ALL" },
                { label: "USER", value: "USER" },
                { label: "ADMIN", value: "ADMIN" },
              ],
            },
            {
              key: "status",
              label: "Status Akun",
              options: [
                { label: "Semua", value: "ALL" },
                { label: "ACTIVE", value: "ACTIVE" },
                { label: "BANNED", value: "BANNED" },
              ],
            },
          ]}
        />
      )}

      {/* Edit/Create User Modal (Simulated) */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          selectedUser ? "Edit Profil Pengguna" : "Tambah Administrator Baru"
        }
        submitLabel={selectedUser ? "Simpan Perubahan" : "Buat User Admin"}
        onSubmit={(e) => {
          e.preventDefault();
          setIsModalOpen(false);
          alert("Aksi simulasi berhasil!");
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block text-xs font-black uppercase tracking-[0.2em] text-black">
              Username
            </label>
            <div className="relative group">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors"
              />
              <input
                type="text"
                defaultValue={selectedUser?.username}
                placeholder="eco_hero_2026"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-black rounded-2xl font-body font-bold text-sm focus:outline-none focus:bg-white focus:shadow-hard transition-all"
              />
            </div>
          </div>
          <div className="space-y-4">
            <label className="block text-xs font-black uppercase tracking-[0.2em] text-black">
              Email Address
            </label>
            <div className="relative group">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors"
              />
              <input
                type="email"
                defaultValue={selectedUser?.email}
                placeholder="hero@ecoquest.id"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-black rounded-2xl font-body font-bold text-sm focus:outline-none focus:bg-white focus:shadow-hard transition-all"
              />
            </div>
          </div>
          <div className="space-y-4">
            <label className="block text-xs font-black uppercase tracking-[0.2em] text-black">
              Role / Hak Akses
            </label>
            <EcoSelect
              icon={Shield}
              value="Standard User"
              onChange={() => {}}
              options={[
                { label: "Standard User", value: "Standard User" },
                { label: "Moderator", value: "Moderator" },
                { label: "Regional Admin", value: "Regional Admin" },
                { label: "Super Admin", value: "Super Admin" },
              ]}
            />
          </div>
          <div className="space-y-4">
            <label className="block text-xs font-black uppercase tracking-[0.2em] text-black">
              Manual Level Adjust
            </label>
            <input
              type="number"
              defaultValue={selectedUser?.level}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-black rounded-2xl font-body font-bold text-sm focus:outline-none focus:bg-white focus:shadow-hard transition-all"
            />
          </div>
        </div>

        {selectedUser && (
          <div className="mt-4 p-4 bg-red-50 border-2 border-red-500 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-red-600 uppercase tracking-wider">
                Zona Bahaya
              </p>
              <p className="text-xs font-bold text-red-500">
                Menghapus user akan menghilangkan seluruh progress game mereka.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(selectedUser)}
              className="p-3 bg-white border-2 border-red-500 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-hard active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              <Trash2 size={20} />
            </button>
          </div>
        )}
      </FormModal>
    </div>
  );
}
