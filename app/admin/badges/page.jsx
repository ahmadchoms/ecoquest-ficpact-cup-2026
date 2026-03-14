"use client";

import { useMemo, useState } from "react";
import { Plus, Award, Info, Image as ImageIcon, Tag } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import DataTable from "@/components/admin/DataTable";
import FormModal from "@/components/admin/FormModal";
import EcoInput from "@/components/ui/EcoInput";
import EcoSelect from "@/components/ui/EcoSelect";
import EcoTextarea from "@/components/ui/EcoTextarea";

import { adminBadgeSchema } from "@/lib/validations/admin";
import {
  useBadges,
  useCreateAdminBadge,
  useUpdateAdminBadge,
  useDeleteAdminBadge,
} from "@/hooks/useBadges";
import {
  DEFAULT_FILTERS,
  DEFAULT_FORM_VALUES,
  RARITY_SELECT_OPTIONS,
  CATEGORY_SELECT_OPTIONS,
  BADGE_TABLE_FILTER_CONFIGS,
} from "@/constants/badgeAdmin";
import { createBadgeColumns } from "@/components/admin/columns/badgeColumn";
import { toast } from "@/lib/toast";
import ConfirmModal from "@/components/admin/ConfirmModal";

export default function BadgesAdminPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [badgeToDelete, setBadgeToDelete] = useState(null);

  const isEditMode = Boolean(selectedBadge);

  const { data: response, isLoading, isError, error } = useBadges(filters);
  const badges = response?.data || [];
  const meta = response?.meta || { total: 0, page: 1, totalPages: 1 };

  const createMutation = useCreateAdminBadge();
  const updateMutation = useUpdateAdminBadge();
  const deleteMutation = useDeleteAdminBadge();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(adminBadgeSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const handleSelectChange = (fieldName) => (e) => {
    const val = e?.target !== undefined ? e.target.value : e;
    setValue(fieldName, val, { shouldValidate: true, shouldDirty: true });
  };

  const handleDeleteConfirm = (badge) => {
    setBadgeToDelete(badge);
  };

  const handleOpenModal = (badge = null) => {
    setSelectedBadge(badge);
    reset(
      badge
        ? {
            name: badge.name,
            description: badge.description,
            rarity: badge.rarity,
            category: badge.category || "COASTAL",
            icon: badge.icon || "",
          }
        : DEFAULT_FORM_VALUES,
    );
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBadge(null);
    reset(DEFAULT_FORM_VALUES);
  };

  const handleDelete = () => {
    if (!badgeToDelete) return;

    deleteMutation.mutate(badgeToDelete.id, {
      onSuccess: () => {
        toast.success(
          "Berhasil Hapus!",
          `Badge ${badgeToDelete.name} telah dihapus.`,
        );
        setBadgeToDelete(null);
      },
      onError: (err) =>
        toast.error("Gagal Hapus!", `Terjadi kesalahan: ${err.message}`),
    });
  };

  const onSubmit = (data) => {
    if (isEditMode) {
      updateMutation.mutate(
        { id: selectedBadge.id, data },
        {
          onSuccess: () => {
            handleCloseModal();
            toast.success(
              "Berhasil Update!",
              `Data badge ${data.name} sukses diperbarui.`,
            );
          },
          onError: (err) =>
            toast.error("Gagal Update!", `Terjadi kesalahan: ${err.message}`),
        },
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          handleCloseModal();
          toast.success(
            "Berhasil Tambah!",
            `Badge ${data.name} telah ditambahkan.`,
          );
        },
        onError: (err) =>
          toast.error("Gagal Tambah!", `Terjadi kesalahan: ${err.message}`),
      });
    }
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const columns = useMemo(
    () =>
      createBadgeColumns({
        onEdit: handleOpenModal,
        onDelete: handleDeleteConfirm,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const isActionPending =
    isSubmitting || createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-8">
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
          onClick={() => handleOpenModal()}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-orange/20 text-orange-700 border-3 border-black rounded-2xl font-display font-black text-xs uppercase tracking-widest shadow-hard hover:shadow-hard-lg hover:-translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
        >
          <Plus size={20} /> Tambah Badge
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
          data={badges}
          isLoading={isLoading}
          onEdit={handleOpenModal}
          paginationMeta={meta}
          onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
          onSearch={(search) => updateFilter("search", search)}
          filterConfigs={BADGE_TABLE_FILTER_CONFIGS}
        />
      )}

      <FormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          isEditMode ? `Edit Badge: ${selectedBadge.name}` : "Desain Badge Baru"
        }
        submitLabel={isEditMode ? "Update Data" : "Terbitkan Badge"}
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isActionPending}
      >
        <div className="space-y-6">
          <EcoInput
            icon={Award}
            label="Nama Badge"
            {...register("name")}
            error={errors.name?.message}
            placeholder="Contoh: Pahlawan Pesisir"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-display font-bold text-sm text-black ml-1">
                Kategori Misi
              </label>
              <EcoSelect
                icon={Tag}
                value={watch("category")}
                onChange={handleSelectChange("category")}
                options={CATEGORY_SELECT_OPTIONS}
                error={errors.category?.message}
              />
            </div>
            <div className="space-y-2">
              <label className="font-display font-bold text-sm text-black ml-1">
                Rarity / Kelangkaan
              </label>
              <EcoSelect
                value={watch("rarity")}
                onChange={handleSelectChange("rarity")}
                options={RARITY_SELECT_OPTIONS}
                error={errors.rarity?.message}
              />
            </div>
          </div>

          <EcoTextarea
            label="Persyaratan (Kriteria)"
            rows={3}
            {...register("description")}
            error={errors.description?.message}
            placeholder="Jelaskan bagaimana user bisa mendapatkan badge ini..."
          />

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <EcoInput
                icon={ImageIcon}
                label="Icon Preview (Emoji/URL)"
                {...register("icon")}
                error={errors.icon?.message}
                placeholder="🏅"
              />
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
                  Badge yang bersifat &apos;Challenger&apos; akan memberikan
                  notifikasi khusus dan efek visual &quot;Sparkle&quot; pada
                  profil pengguna yang memilikinya.
                </p>
              </div>
            </div>
          </div>
        </div>
      </FormModal>

      <ConfirmModal
        isOpen={Boolean(badgeToDelete)}
        onClose={() => setBadgeToDelete(null)}
        onConfirm={handleDelete}
        title="Hapus Badge?"
        message={`Apakah kamu yakin ingin menghapus badge "${badgeToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        isLoading={deleteMutation.isPending}
        isDestructive={true}
      />
    </div>
  );
}
