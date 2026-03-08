"use client";

import { useMemo, useState } from "react";
import { Plus, Tag, AlignLeft, Calendar as CalendarIcon, Package, Sparkles } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import DataTable from "@/components/admin/DataTable";
import FormModal from "@/components/admin/FormModal";
import EcoInput from "@/components/ui/EcoInput";
import EcoTextarea from "@/components/ui/EcoTextarea";
import EcoSelect from "@/components/ui/EcoSelect";
import EcoFile from "@/components/ui/EcoFile";
import { createShopItemColumns } from "@/components/admin/columns/shopItemColumn";

import { adminShopItemSchema } from "@/lib/validations/admin";
import {
  useShopItems,
  useEventOptions,
  useCreateAdminShopItem,
  useUpdateAdminShopItem,
  useDeleteAdminShopItem,
} from "@/hooks/useShopItems";

import {
  DEFAULT_FILTERS,
  DEFAULT_FORM_VALUES,
  TYPE_SELECT_OPTIONS,
  SHOP_ITEM_TABLE_FILTER_CONFIGS,
} from "@/constants/shopItemAdmin";
import { toast } from "@/lib/toast";
import ConfirmModal from "@/components/admin/ConfirmModal";

export default function ShopItemsAdminPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const isEditMode = Boolean(selectedItem);

  const { data: response, isLoading, isError, error } = useShopItems(filters);
  const items = response?.data || [];
  const meta = response?.meta || { total: 0, page: 1, totalPages: 1 };

  const { data: eventOptions = [], isLoading: isLoadingEvents } = useEventOptions();

  const createMutation = useCreateAdminShopItem();
  const updateMutation = useUpdateAdminShopItem();
  const deleteMutation = useDeleteAdminShopItem();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(adminShopItemSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const selectedType = watch("type");

  const handleSelectChange =
    (fieldName, isNullable = false) =>
    (e) => {
      let val = e?.target !== undefined ? e.target.value : e;
      if (isNullable && val === "") val = null;
      setValue(fieldName, val, { shouldValidate: true, shouldDirty: true });
    };

  const handleOpenModal = (item = null) => {
    setSelectedItem(item);
    
    reset(
      item
        ? {
            ...DEFAULT_FORM_VALUES,
            ...item,
            eventId: item.eventId || "",
          }
        : DEFAULT_FORM_VALUES,
    );
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    reset(DEFAULT_FORM_VALUES);
  };

  const handleDeleteConfirm = (item) => {
    setItemToDelete(item);
  };

  const handleDelete = () => {
    if (!itemToDelete) return;

    deleteMutation.mutate(itemToDelete.id, {
      onSuccess: () =>
        toast.success(
          "Berhasil Hapus!",
          `Item ${itemToDelete.name} telah dihapus.`,
        ),
      onError: (err) =>
        toast.error("Gagal Hapus!", `Terjadi kesalahan: ${err.message}`),
    });
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    
    formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("type", data.type);
    formData.append("isActive", data.isActive);
    
    if (data.eventId) {
        formData.append("eventId", data.eventId);
    }

    // Append content logic depending on if it's a file
    if (data.content instanceof File) {
      formData.append("content", data.content);
    } else if (data.content) {
      formData.append("content", data.content); // Kept as URL or text
    } else if (data.content === null) {
      formData.append("content", "null");
    }

    if (isEditMode) {
      updateMutation.mutate(
        { id: selectedItem.id, data: formData },
        {
          onSuccess: () => {
            handleCloseModal();
            toast.success(
              "Berhasil Update!",
              `Data item ${data.name} sukses diperbarui.`,
            );
          },
          onError: (err) =>
            toast.error("Gagal Update!", `Terjadi kesalahan: ${err.message}`),
        },
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          handleCloseModal();
          toast.success("Berhasil Buat!", `Item ${data.name} sukses dibuat.`);
        },
        onError: (err) =>
          toast.error("Gagal Buat!", `Terjadi kesalahan: ${err.message}`),
      });
    }
  };

  const columns = useMemo(
    () =>
      createShopItemColumns({
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
            Manajemen <span className="text-emerald-600">Shop</span>
          </h1>
          <p className="font-body font-bold text-slate-500 mt-1">
            Kelola banner, border, dan item toko lainnya beserta sistem poin.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-mint border-3 border-black rounded-2xl font-display font-black text-xs uppercase tracking-widest text-black shadow-hard hover:shadow-hard-lg hover:-translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
        >
          <Plus size={20} /> Tambah Item
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
          data={items}
          isLoading={isLoading}
          onEdit={handleOpenModal}
          paginationMeta={meta}
          onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
          onSearch={(search) =>
            setFilters((prev) => ({ ...prev, search, page: 1 }))
          }
          filterConfigs={SHOP_ITEM_TABLE_FILTER_CONFIGS}
          searchPlaceholder="Cari nama item..."
          emptyMessage="Belum ada item toko yang dibuat"
        />
      )}

      <FormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          isEditMode ? `Edit Item: ${selectedItem.name}` : "Buat Item Toko"
        }
        submitLabel={isEditMode ? "Update Item" : "Buat Item"}
        size="lg"
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isActionPending}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <EcoInput
              icon={Package}
              label="Nama Item"
              placeholder="E.g. Banner Ekologikal"
              {...register("name")}
              error={errors.name?.message}
            />
            
            <EcoTextarea
              icon={AlignLeft}
              label="Deskripsi (opsional)"
              placeholder="Berikan penjelasan detail item..."
              rows={3}
              {...register("description")}
              error={errors.description?.message}
            />

            <EcoInput
              type="number"
              icon={Tag}
              label="Harga Poin"
              {...register("price", { valueAsNumber: true })}
              error={errors.price?.message}
              min={0}
            />

            <div className="space-y-2">
              <label className="font-display font-bold text-sm text-black ml-1">
                Keterkaitan Event
              </label>
              <EcoSelect
                icon={CalendarIcon}
                value={watch("eventId") || ""}
                onChange={handleSelectChange("eventId", true)}
                options={[
                  { label: "Tidak Ada (Permanen)", value: "" },
                  ...eventOptions,
                ]}
                error={errors.eventId?.message}
                disabled={isLoadingEvents}
              />
              <p className="text-xs text-slate-500 ml-1">
                Pilih event jika item ini adalah item Limited Edition
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="font-display font-bold text-sm text-black ml-1">
                Tipe Item
              </label>
              <EcoSelect
                icon={Sparkles}
                value={selectedType}
                onChange={handleSelectChange("type")}
                options={TYPE_SELECT_OPTIONS}
                error={errors.type?.message}
              />
            </div>

            {/* Dynamic Content Field Input depending on type */}
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <EcoFile
                  label={selectedType === "BANNER" ? "Unggah Gambar Banner" : "Unggah Gambar Border (PNG/SVG Transparan)"}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.content?.message}
                />
              )}
            />

            <div className="space-y-2">
              <label className="font-display font-bold text-sm text-black ml-1">
                Status Aktif
              </label>
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    {...register("isActive")}
                  />
                  <div className="w-14 h-7 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-yellow rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500 border-2 border-black" />
                </label>
                <span className="font-body font-bold text-sm text-slate-600">
                  {watch("isActive") ? "Tersedia di Toko" : "Disembunyikan"}
                </span>
              </div>
              {errors.isActive && (
                <span className="text-xs text-red-500 block">
                  {errors.isActive.message}
                </span>
              )}
            </div>
          </div>
        </div>
      </FormModal>

      <ConfirmModal
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDelete}
        title="Hapus Item Toko?"
        message={`Apakah kamu yakin ingin menghapus item "${itemToDelete?.name}"? Tindakan ini tidak dapat dibatalkan dan akan mencabut item ini dari semua inventory user.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        isLoading={deleteMutation.isPending}
        isDestructive={true}
      />
    </div>
  );
}
