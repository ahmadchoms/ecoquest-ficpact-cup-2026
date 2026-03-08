"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Tag,
  AlignLeft,
  Calendar as CalendarIcon,
  Activity,
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import DataTable from "@/components/admin/DataTable";
import FormModal from "@/components/admin/FormModal";
import EcoInput from "@/components/ui/EcoInput";
import EcoTextarea from "@/components/ui/EcoTextarea";
import EcoSelect from "@/components/ui/EcoSelect";
import EcoFile from "@/components/ui/EcoFile";
import { createEventColumns } from "@/components/admin/columns/eventColumn";

import { adminEventSchema } from "@/lib/validations/admin";
import {
  useEvents,
  useCreateAdminEvent,
  useUpdateAdminEvent,
  useDeleteAdminEvent,
} from "@/hooks/useEvents";

import {
  DEFAULT_FILTERS,
  DEFAULT_FORM_VALUES,
  STATUS_FILTER_OPTIONS,
  EVENT_TABLE_FILTER_CONFIGS,
} from "@/constants/eventAdmin";
import { toast } from "@/lib/toast";
import ConfirmModal from "@/components/admin/ConfirmModal";
import EcoCalendar from "@/components/ui/EcoCalender";

export default function EventsAdminPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);

  const isEditMode = Boolean(selectedEvent);

  const { data: response, isLoading, isError, error } = useEvents(filters);
  const events = response?.data || [];
  const meta = response?.meta || { total: 0, page: 1, totalPages: 1 };

  const createMutation = useCreateAdminEvent();
  const updateMutation = useUpdateAdminEvent();
  const deleteMutation = useDeleteAdminEvent();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(adminEventSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const handleOpenModal = (event = null) => {
    setSelectedEvent(event);

    // Format dates to YYYY-MM-DD for native input
    const initialValues = event
      ? {
          ...DEFAULT_FORM_VALUES,
          ...event,
          startDate: event.startDate
            ? new Date(event.startDate).toISOString().split("T")[0]
            : undefined,
          endDate: event.endDate
            ? new Date(event.endDate).toISOString().split("T")[0]
            : undefined,
        }
      : DEFAULT_FORM_VALUES;

    reset(initialValues);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    reset(DEFAULT_FORM_VALUES);
  };

  const handleDeleteConfirm = (event) => {
    setEventToDelete(event);
  };

  const handleDelete = () => {
    if (!eventToDelete) return;

    deleteMutation.mutate(eventToDelete.id, {
      onSuccess: () => {
        toast.success(
          "Berhasil Hapus!",
          `Event ${eventToDelete.name} telah dihapus.`,
        );
        setEventToDelete(null);
      },
      onError: (err) =>
        toast.error("Gagal Hapus!", `Terjadi kesalahan: ${err.message}`),
    });
  };

  const onSubmit = (data) => {
    // Construct FormData
    const formData = new FormData();

    // Append standard fields
    formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    // Append ISO dates
    formData.append("startDate", new Date(data.startDate).toISOString());
    formData.append("endDate", new Date(data.endDate).toISOString());

    formData.append("isActive", data.isActive);

    // Append file if it's a File object (new upload)
    if (data.bannerUrl instanceof File) {
      formData.append("bannerUrl", data.bannerUrl);
    } else if (data.bannerUrl === null) {
      // Explicitly removed
      formData.append("bannerUrl", "null");
    }

    if (isEditMode) {
      updateMutation.mutate(
        { id: selectedEvent.id, data: formData },
        {
          onSuccess: () => {
            handleCloseModal();
            toast.success(
              "Berhasil Update!",
              `Data event ${data.name} sukses diperbarui.`,
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
          toast.success("Berhasil Buat!", `Event ${data.name} sukses dibuat.`);
        },
        onError: (err) =>
          toast.error("Gagal Buat!", `Terjadi kesalahan: ${err.message}`),
      });
    }
  };

  const columns = useMemo(
    () =>
      createEventColumns({
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
            Manajemen <span className="text-emerald-600">Event</span>
          </h1>
          <p className="font-body font-bold text-slate-500 mt-1">
            Buat dan kelola event berbatas waktu, serta tentukan periode
            aktifnya.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-mint border-3 border-black rounded-2xl font-display font-black text-xs uppercase tracking-widest text-black shadow-hard hover:shadow-hard-lg hover:-translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
        >
          <Plus size={20} /> Tambah Event
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
          data={events}
          isLoading={isLoading}
          onEdit={handleOpenModal}
          paginationMeta={meta}
          onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
          onSearch={(search) =>
            setFilters((prev) => ({ ...prev, search, page: 1 }))
          }
          filterConfigs={EVENT_TABLE_FILTER_CONFIGS}
          searchPlaceholder="Cari nama atau event..."
          emptyMessage="Belum ada event yang dibuat"
        />
      )}

      <FormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          isEditMode ? `Edit Event: ${selectedEvent.name}` : "Buat Event Baru"
        }
        submitLabel={isEditMode ? "Update Event" : "Buat Event"}
        size="lg"
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isActionPending}
      >
        <div className="space-y-6">
          <EcoInput
            icon={Tag}
            label="Nama Event"
            placeholder="E.g. Festival Peduli Lingkungan 2026"
            {...register("name")}
            error={errors.name?.message}
          />
          <EcoTextarea
            icon={AlignLeft}
            label="Deskripsi Event (opsional)"
            placeholder="Jelaskan detail mengenai event ini..."
            rows={3}
            {...register("description")}
            error={errors.description?.message}
          />

          <Controller
            name="bannerUrl"
            control={control}
            render={({ field }) => (
              <EcoFile
                label="Banner Event (opsional)"
                value={field.value}
                onChange={field.onChange}
                error={errors.bannerUrl?.message}
              />
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <EcoCalendar
                  icon={CalendarIcon}
                  label="Tanggal Mulai"
                  value={field.value}
                  onChange={field.onChange}
                  ref={field.ref}
                  error={errors.startDate?.message}
                />
              )}
            />

            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <EcoCalendar
                  icon={CalendarIcon}
                  label="Tanggal Selesai"
                  value={field.value}
                  onChange={field.onChange}
                  ref={field.ref}
                  error={errors.endDate?.message}
                />
              )}
            />
          </div>

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
                <div className="w-14 h-7 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-yellow rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500 border-2 border-black" />
              </label>
              <span className="font-body font-bold text-sm text-slate-600">
                {watch("isActive") ? "Event Sedang Aktif" : "Event Tidak Aktif"}
              </span>
            </div>
            {errors.isActive && (
              <span className="text-xs text-red-500 block">
                {errors.isActive.message}
              </span>
            )}
          </div>
        </div>
      </FormModal>

      <ConfirmModal
        isOpen={Boolean(eventToDelete)}
        onClose={() => setEventToDelete(null)}
        onConfirm={handleDelete}
        title="Hapus Event?"
        message={`Apakah kamu yakin ingin menghapus event "${eventToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        isLoading={deleteMutation.isPending}
        isDestructive={true}
      />
    </div>
  );
}
