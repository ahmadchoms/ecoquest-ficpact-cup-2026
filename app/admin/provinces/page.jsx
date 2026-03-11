"use client";

import { useMemo, useState } from "react";
import {
  Map,
  Info,
  AlertTriangle,
  Layers,
  Lightbulb,
  Leaf,
  Cat,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import DataTable from "@/components/admin/DataTable";
import FormModal from "@/components/admin/FormModal";
import EcoInput from "@/components/ui/EcoInput";
import EcoSelect from "@/components/ui/EcoSelect";
import EcoTextarea from "@/components/ui/EcoTextarea";
import ConfirmModal from "@/components/admin/ConfirmModal";

import { adminProvinceSchema } from "@/lib/validations/admin";
import {
  useProvinces,
  useUpdateAdminProvince,
  useDeleteAdminProvince,
} from "@/hooks/useProvinces";
import {
  DEFAULT_FILTERS,
  REGION_SELECT_OPTIONS,
  DIFFICULTY_SELECT_OPTIONS,
  PROVINCE_TABLE_FILTER_CONFIGS,
  DEFAULT_FORM_VALUES,
} from "@/constants/provinceAdmin";
import { createProvinceColumns } from "@/components/admin/columns/provinceColumn";
import { toast } from "@/lib/toast";

export default function ProvincesAdminPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [provinceToDelete, setProvinceToDelete] = useState(null);

  const { data: response, isLoading, isError, error } = useProvinces(filters);
  const provinces = response?.data || [];
  const meta = response?.meta || { total: 0, page: 1, totalPages: 1 };

  const updateMutation = useUpdateAdminProvince();
  const deleteMutation = useDeleteAdminProvince();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(adminProvinceSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const handleSelectChange = (fieldName) => (e) => {
    const val = e?.target !== undefined ? e.target.value : e;
    setValue(fieldName, val, { shouldValidate: true, shouldDirty: true });
  };

  const handleOpenModal = (province) => {
    if (!province) return;
    setSelectedProvince(province);
    reset({
      name: province.name,
      region: province.region || "JAWA",
      threatLevel: province.threatLevel || "LOW",
      description: province.description || "",
      funFact: province.funFact || "",
      ecosystems: province.ecosystems?.join(", ") || "",
      species: province.species?.join(", ") || "",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProvince(null);
    reset(DEFAULT_FORM_VALUES);
  };

  const handleDeleteConfirm = (province) => {
    setProvinceToDelete(province);
  };

  const handleDelete = () => {
    if (!provinceToDelete) return;

    deleteMutation.mutate(provinceToDelete.id, {
      onSuccess: () => {
        toast.success(
          "Berhasil Hapus!",
          `Provinsi ${provinceToDelete.name} telah dihapus.`,
        );
        setProvinceToDelete(null);
      },
      onError: (err) => {
        toast.error("Gagal Hapus!", `Terjadi kesalahan: ${err.message}`);
        setProvinceToDelete(null);
      },
    });
  };

  const onSubmit = (data) => {
    if (!selectedProvince) return;

    updateMutation.mutate(
      { id: selectedProvince.id, data },
      {
        onSuccess: () => {
          handleCloseModal();
          toast.success(
            "Berhasil Update!",
            `Data provinsi ${data.name} sukses diperbarui.`,
          );
        },
        onError: (err) =>
          toast.error("Gagal Update!", `Terjadi kesalahan: ${err.message}`),
      },
    );
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const columns = useMemo(
    () =>
      createProvinceColumns({
        onEdit: handleOpenModal,
        onDelete: handleDeleteConfirm,
      }),
    [],
  );

  const isActionPending = isSubmitting || updateMutation.isPending;

  return (
    <div className="space-y-8">
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
          data={provinces}
          isLoading={isLoading}
          onEdit={handleOpenModal}
          paginationMeta={meta}
          onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
          onSearch={(search) => updateFilter("search", search)}
          filterConfigs={PROVINCE_TABLE_FILTER_CONFIGS}
        />
      )}

      <FormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={`Edit Data: ${selectedProvince?.name || ""}`}
        submitLabel="Update Data"
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isActionPending}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EcoInput
              icon={Map}
              label="Nama Provinsi"
              {...register("name")}
              error={errors.name?.message}
              placeholder="Contoh: Jawa Timur"
            />
            <div className="space-y-2">
              <label className="font-display font-bold text-sm text-black ml-1">
                Wilayah
              </label>
              <EcoSelect
                value={watch("region")}
                onChange={handleSelectChange("region")}
                options={REGION_SELECT_OPTIONS}
                error={errors.region?.message}
              />
            </div>

            <div className="space-y-2">
              <label className="font-display font-bold text-sm text-black ml-1">
                Threat Level
              </label>
              <EcoSelect
                icon={AlertTriangle}
                value={watch("threatLevel")}
                onChange={handleSelectChange("threatLevel")}
                options={DIFFICULTY_SELECT_OPTIONS}
                error={errors.threatLevel?.message}
              />
            </div>

            <EcoInput
              icon={Lightbulb}
              label="Fun Fact"
              {...register("funFact")}
              error={errors.funFact?.message}
              placeholder="Fakta unik tentang provinsi ini..."
            />

            <EcoInput
              icon={Leaf}
              label="Ekosistem (pisahkan dengan koma)"
              {...register("ecosystems")}
              error={errors.ecosystems?.message}
              placeholder="Hutan Hujan, Sabana, Mangrove"
            />

            <EcoInput
              icon={Cat}
              label="Spesies (pisahkan dengan koma)"
              {...register("species")}
              error={errors.species?.message}
              placeholder="Harimau Sumatera, Orangutan"
            />
          </div>

          <div className="relative">
            <div className="absolute left-4 top-9.5 text-slate-400 z-10">
              <Layers size={18} />
            </div>
            <EcoTextarea
              label="Status Ekosistem & Deskripsi"
              rows={3}
              {...register("description")}
              error={errors.description?.message}
              placeholder="Deskripsi singkat kondisi lingkungan di wilayah ini..."
              className="pl-12"
            />
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

      <ConfirmModal
        isOpen={Boolean(provinceToDelete)}
        onClose={() => setProvinceToDelete(null)}
        onConfirm={handleDelete}
        title="Hapus Provinsi?"
        message={`Apakah kamu yakin ingin menghapus data provinsi "${provinceToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        isLoading={deleteMutation.isPending}
        isDestructive={true}
      />
    </div>
  );
}
