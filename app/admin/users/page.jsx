"use client";

import { useState, useMemo } from "react";
import { Plus, User, Mail, Shield, Key } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import DataTable from "@/components/admin/DataTable";
import FormModal from "@/components/admin/FormModal";
import EcoInput from "@/components/ui/EcoInput";
import EcoSelect from "@/components/ui/EcoSelect";

import { createUserColumns } from "@/components/admin/columns/userColumns";
import {
  useUsers,
  useCreateAdminUser,
  useUpdateAdminUser,
  useDeleteAdminUser,
} from "@/hooks/useUsers";
import { adminUserSchema } from "@/lib/validations/admin";
import {
  DEFAULT_FILTERS,
  DEFAULT_FORM_VALUES,
  ROLE_SELECT_OPTIONS,
  USER_TABLE_FILTER_CONFIGS,
} from "@/constants/userAdmin";
import { toast } from "@/lib/toast";
import ConfirmModal from "@/components/admin/ConfirmModal";

function ErrorState({ message }) {
  return (
    <div className="p-8 bg-red-50 border-3 border-black rounded-3xl text-center">
      <h2 className="text-xl font-display font-black text-red-600 mb-2">
        Gagal Memuat Data
      </h2>
      <p className="font-body font-bold text-slate-700">
        {message || "Terjadi kesalahan server"}
      </p>
    </div>
  );
}

export default function UsersAdminPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  const isEditMode = Boolean(selectedUser);

  const { data: response, isLoading, isError, error } = useUsers(filters);
  const users = response?.data ?? [];
  const meta = response?.meta ?? { total: 0, page: 1, totalPages: 1 };

  const createMutation = useCreateAdminUser();
  const updateMutation = useUpdateAdminUser();
  const deleteMutation = useDeleteAdminUser();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(adminUserSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const handleSelectChange = (fieldName) => (e) => {
    const val = e?.target !== undefined ? e.target.value : e;
    setValue(fieldName, val, { shouldValidate: true, shouldDirty: true });
  };

  const handleDeleteConfirm = (user) => {
    setUserToDelete(user);
  };

  const openModal = (user = null) => {
    setSelectedUser(user);
    reset(
      user
        ? {
            username: user.username,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            level: user.level,
            xp: user.xp,
            points: user.points ?? 0,
          }
        : DEFAULT_FORM_VALUES,
    );
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
    reset(DEFAULT_FORM_VALUES);
  };

  const handleDelete = () => {
    if (!userToDelete) return;

    deleteMutation.mutate(userToDelete.id, {
      onSuccess: () => {
        closeModal();
        setUserToDelete(null);
        toast.success(
          "Berhasil Hapus!",
          `Pengguna ${userToDelete.username} telah dihapus.`,
        );
      },
      onError: (err) => {
        (toast.error("Gagal Hapus!", `Terjadi kesalahan: ${err.message}`),
          setUserToDelete(null));
      },
    });
  };

  const onSubmit = (data) => {
    if (isEditMode) {
      updateMutation.mutate(
        { id: selectedUser.id, data },
        {
          onSuccess: () => {
            closeModal();
            toast.success(
              "Berhasil Update!",
              `Data pengguna ${data.username} sukses diperbarui.`,
            );
          },
          onError: (err) =>
            toast.error("Gagal Update!", `Terjadi kesalahan: ${err.message}`),
        },
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          closeModal();
          toast.success(
            "Berhasil Buat!",
            `Pengguna ${data.username} berhasil dibuat.`,
          );
        },
        onError: (err) =>
          toast.error("Gagal Buat!", `Terjadi kesalahan: ${err.message}`),
      });
    }
  };

  const updateFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));

  const columns = useMemo(
    () =>
      createUserColumns({ onEdit: openModal, onDelete: handleDeleteConfirm }),
    [],
  );

  const isActionPending =
    isSubmitting || createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-black uppercase tracking-tight">
            Manajemen <span className="text-emerald-600">Pengguna</span>
          </h1>
          <p className="font-body font-bold text-slate-500 mt-1">
            Kelola akun explorer EcoQuest
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-yellow border-3 border-black rounded-2xl font-display font-black text-xs uppercase tracking-widest text-black shadow-hard hover:shadow-hard-lg hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all w-full md:w-auto"
        >
          <Plus size={20} /> Tambah User
        </button>
      </div>

      {isError ? (
        <ErrorState message={error?.message} />
      ) : (
        <DataTable
          columns={columns}
          data={users}
          isLoading={isLoading}
          paginationMeta={meta}
          onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
          onSearch={(search) => updateFilter("search", search)}
          filterConfigs={USER_TABLE_FILTER_CONFIGS}
        />
      )}

      <FormModal
        isOpen={modalOpen}
        onClose={closeModal}
        title={isEditMode ? "Edit Pengguna" : "Tambah Pengguna Baru"}
        submitLabel={isEditMode ? "Simpan Perubahan" : "Buat Pengguna"}
        onSubmit={handleSubmit(onSubmit)}
        isSubmitting={isActionPending}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EcoInput
            icon={User}
            label="Username"
            {...register("username")}
            error={errors.username?.message}
            placeholder="eco_explorer_01"
          />

          <EcoInput
            icon={User}
            label="Nama"
            {...register("name")}
            error={errors.name?.message}
            placeholder="John Doe"
          />

          <EcoInput
            icon={Mail}
            label="Email"
            type="email"
            {...register("email")}
            error={errors.email?.message}
            placeholder="explorer@ecoquest.id"
          />

          <EcoInput
            icon={Key}
            label={isEditMode ? "Password Baru (opsional)" : "Password"}
            type="password"
            {...register("password")}
            error={errors.password?.message}
            placeholder={
              isEditMode
                ? "(kosongkan jika tidak ingin ubah)"
                : "minimal 6 karakter"
            }
          />

          <div className="space-y-2 col-span-2">
            <label className="font-display font-bold text-sm text-black ml-1">
              Role
            </label>
            <EcoSelect
              icon={Shield}
              value={watch("role")}
              onChange={handleSelectChange("role")}
              options={ROLE_SELECT_OPTIONS}
              error={errors.role?.message}
            />
          </div>

          <div className="col-span-2 grid grid-cols-3 gap-6">
            <EcoInput
              label="Level"
              type="number"
              {...register("level", { valueAsNumber: true })}
              error={errors.level?.message}
              min={1}
            />

            <EcoInput
              label="XP Awal"
              type="number"
              {...register("xp", { valueAsNumber: true })}
              error={errors.xp?.message}
              min={0}
            />

            <EcoInput
              label="Poin Awal"
              type="number"
              {...register("points", { valueAsNumber: true })}
              error={errors.points?.message}
              min={0}
            />
          </div>
        </div>
      </FormModal>

      <ConfirmModal
        isOpen={Boolean(userToDelete)}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDelete}
        title="Hapus Pengguna?"
        message={`Apakah kamu yakin ingin menghapus akun explorer "${userToDelete?.username}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        isLoading={deleteMutation.isPending}
        isDestructive={true}
      />
    </div>
  );
}
