"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Target,
  Zap,
  Tag,
  Globe,
  MessageSquare,
  MapPin,
  Award,
  Clock,
  Star,
  Activity,
  Image as ImageIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import DataTable from "@/components/admin/DataTable";
import FormModal from "@/components/admin/FormModal";
import EcoInput from "@/components/ui/EcoInput";
import EcoSelect from "@/components/ui/EcoSelect";
import EcoTextarea from "@/components/ui/EcoTextarea";
import { createMissionColumns } from "@/components/admin/columns/missionColumn";

import { adminMissionSchema } from "@/lib/validations/admin";
import {
  useMissions,
  useProvinceOptions,
  useBadgeOptions,
  useCreateAdminMission,
  useUpdateAdminMission,
  useDeleteAdminMission,
} from "@/hooks/useMissions";

import {
  DEFAULT_FILTERS,
  DEFAULT_FORM_VALUES,
  CATEGORY_SELECT_OPTIONS,
  TYPE_SELECT_OPTIONS,
  DIFFICULTY_SELECT_OPTIONS,
  STATUS_SELECT_OPTIONS,
  MISSION_TABLE_FILTER_CONFIGS,
} from "@/constants/missionAdmin";
import { toast } from "@/lib/toast";
import ConfirmModal from "@/components/admin/ConfirmModal";

export default function MissionsAdminPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);
  const [missionToDelete, setMissionToDelete] = useState(null);

  const isEditMode = Boolean(selectedMission);

  const { data: response, isLoading, isError, error } = useMissions(filters);
  const missions = response?.data || [];
  const meta = response?.meta || { total: 0, page: 1, totalPages: 1 };

  const { data: provinceOptions = [], isLoading: isLoadingProvinces } =
    useProvinceOptions();
  const { data: badgeOptions = [], isLoading: isLoadingBadges } =
    useBadgeOptions();

  const createMutation = useCreateAdminMission();
  const updateMutation = useUpdateAdminMission();
  const deleteMutation = useDeleteAdminMission();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(adminMissionSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const handleSelectChange =
    (fieldName, isNullable = false) =>
    (e) => {
      let val = e?.target !== undefined ? e.target.value : e;

      if (isNullable && val === "") val = null;

      setValue(fieldName, val, { shouldValidate: true, shouldDirty: true });
    };

  const handleDeleteConfirm = (mission) => {
    setMissionToDelete(mission);
  };

  const handleOpenModal = (mission = null) => {
    setSelectedMission(mission);
    reset(
      mission ? { ...DEFAULT_FORM_VALUES, ...mission } : DEFAULT_FORM_VALUES,
    );
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMission(null);
    reset(DEFAULT_FORM_VALUES);
  };

  const handleDelete = () => {
    if (!missionToDelete) return;

    deleteMutation.mutate(missionToDelete.id, {
      onSuccess: () =>
        toast.success(
          "Berhasil Hapus!",
          `Misi ${missionToDelete.title} telah dihapus.`,
        ),
      onError: (err) =>
        toast.error("Gagal Hapus!", `Terjadi kesalahan: ${err.message}`),
    });
  };

  const onSubmit = (data) => {
    if (isEditMode) {
      updateMutation.mutate(
        { id: selectedMission.id, data },
        {
          onSuccess: () => {
            handleCloseModal();
            toast.success(
              "Berhasil Update!",
              `Data misi ${data.title} sukses diperbarui.`,
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
          toast.success("Berhasil Buat!", `Misi ${data.title} sukses dibuat.`);
        },
        onError: (err) =>
          toast.error("Gagal Buat!", `Terjadi kesalahan: ${err.message}`),
      });
    }
  };

  const columns = useMemo(
    () =>
      createMissionColumns({
        onEdit: handleOpenModal,
        onDelete: handleDeleteConfirm,
      }),

    [],
  );

  const isActionPending =
    isSubmitting || createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-black uppercase tracking-tight">
            Manajemen <span className="text-emerald-600">Misi</span>
          </h1>
          <p className="font-body font-bold text-slate-500 mt-1">
            Buat tantangan baru, sesuaikan reward XP, dan pantau tingkat
            penyelesaian.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-mint border-3 border-black rounded-2xl font-display font-black text-xs uppercase tracking-widest text-black shadow-hard hover:shadow-hard-lg hover:-translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
        >
          <Plus size={20} /> Tambah Misi
        </button>
      </div>

      {isError ? (
        <div className="p-8 bg-red-50 border-3 border-black rounded-3xl text-center">
          <h2 className="text-xl font-display font-black text-red-600 mb-2">
            Gagal Memuat Data
          </h2>
          <p className="font-body font-bold text-slate-700">{error?.message}</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={missions}
          isLoading={isLoading}
          onEdit={handleOpenModal}
          paginationMeta={meta}
          onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
          onSearch={(search) =>
            setFilters((prev) => ({ ...prev, search, page: 1 }))
          }
          filterConfigs={MISSION_TABLE_FILTER_CONFIGS}
        />
      )}

      <FormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          isEditMode ? `Edit Misi: ${selectedMission.title}` : "Buat Misi Baru"
        }
        submitLabel={isEditMode ? "Update Misi" : "Terbitkan Misi"}
        size="lg"
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isActionPending}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <EcoInput
              icon={Target}
              label="Judul Misi"
              placeholder="Bersihkan Pantai Kuta"
              {...register("title")}
              error={errors.title?.message}
            />
            <EcoInput
              label="Subtitle (opsional)"
              placeholder="Tantangan untuk menjaga kebersihan pantai di Bali"
              {...register("subtitle")}
              error={errors.subtitle?.message}
            />
            <EcoTextarea
              label="Deskripsi Misi"
              placeholder="Bergabunglah dalam misi membersihkan Pantai Kuta! Kumpulkan sampah plastik, kertas, dan logam untuk membantu menjaga keindahan dan kesehatan ekosistem laut Bali."
              rows={4}
              {...register("description")}
              error={errors.description?.message}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="font-display font-bold text-sm text-black ml-1">
                  Kategori
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
                  Tipe
                </label>
                <EcoSelect
                  value={watch("type")}
                  onChange={handleSelectChange("type")}
                  options={TYPE_SELECT_OPTIONS}
                  error={errors.type?.message}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="font-display font-bold text-sm text-black ml-1">
                Lokasi Provinsi
              </label>
              <EcoSelect
                icon={MapPin}
                value={watch("provinceId") || ""}
                onChange={handleSelectChange("provinceId")}
                options={[
                  { label: "Pilih Provinsi...", value: "" },
                  ...provinceOptions,
                ]}
                error={errors.provinceId?.message}
                disabled={isLoadingProvinces}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="font-display font-bold text-sm text-black ml-1">
                  Kesulitan
                </label>
                <EcoSelect
                  value={watch("difficulty")}
                  onChange={handleSelectChange("difficulty")}
                  options={DIFFICULTY_SELECT_OPTIONS}
                  error={errors.difficulty?.message}
                />
              </div>
              <div className="space-y-2">
                <label className="font-display font-bold text-sm text-black ml-1">
                  Status
                </label>
                <EcoSelect
                  icon={Activity}
                  value={watch("status")}
                  onChange={handleSelectChange("status")}
                  options={STATUS_SELECT_OPTIONS}
                  error={errors.status?.message}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <EcoInput
                icon={Zap}
                label="XP Reward"
                type="number"
                {...register("xpReward", { valueAsNumber: true })}
                error={errors.xpReward?.message}
                min={0}
              />
              <EcoInput
                icon={Star}
                label="Points Reward"
                type="number"
                {...register("pointsReward", { valueAsNumber: true })}
                error={errors.pointsReward?.message}
                min={0}
              />
            </div>

            <EcoInput
              icon={Clock}
              label="Estimasi Waktu (opsional)"
              {...register("timeEstimate")}
              error={errors.timeEstimate?.message}
              placeholder="Contoh: 30 Menit"
            />
            <EcoInput
              icon={ImageIcon}
              label="URL Ikon (opsional)"
              {...register("icon")}
              error={errors.icon?.message}
              placeholder="🐈"
            />

            <div className="space-y-2">
              <label className="font-display font-bold text-sm text-black ml-1">
                Reward Badge
              </label>
              <EcoSelect
                icon={Award}
                value={watch("badgeRewardId") || ""}
                onChange={handleSelectChange("badgeRewardId", true)}
                options={[
                  { label: "-- Tidak Ada --", value: "" },
                  ...badgeOptions,
                ]}
                error={errors.badgeRewardId?.message}
                disabled={isLoadingBadges}
              />
            </div>
          </div>
        </div>
      </FormModal>

      <ConfirmModal
        isOpen={Boolean(missionToDelete)}
        onClose={() => setMissionToDelete(null)}
        onConfirm={handleDelete}
        title="Hapus Misi?"
        message={`Apakah kamu yakin ingin menghapus misi "${missionToDelete?.title}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        isLoading={deleteMutation.isPending}
        isDestructive={true}
      />
    </div>
  );
}
