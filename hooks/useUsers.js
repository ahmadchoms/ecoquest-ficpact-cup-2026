import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminAPI } from "@/lib/api/admin";

// Query Keys
export const adminUserKeys = {
  all: ["admin", "users"],
  lists: () => [...adminUserKeys.all, "list"],
  list: (filters) => [...adminUserKeys.lists(), filters],
  details: () => [...adminUserKeys.all, "detail"],
  detail: (id) => [...adminUserKeys.details(), id],
};

// Helper
const invalidateUserQueries = (queryClient, userId = null) => {
  queryClient.invalidateQueries({ queryKey: adminUserKeys.lists() });
  queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
  if (userId) {
    queryClient.invalidateQueries({ queryKey: adminUserKeys.detail(userId) });
  }
};

// Hooks
/** Fetch daftar user dengan filter & pagination */
export const useUsers = (filters) => {
  return useQuery({
    queryKey: adminUserKeys.list(filters),
    queryFn: () => AdminAPI.getUsers(filters),
    // placeholderData menggantikan keepPreviousData (deprecated di v5)
    placeholderData: (prev) => prev,
  });
};

/** Buat user baru */
export const useCreateAdminUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => AdminAPI.createUser(data),
    onSuccess: () => invalidateUserQueries(queryClient),
  });
};

/** Update data user berdasarkan ID */
export const useUpdateAdminUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => AdminAPI.updateUser(id, data),
    onSuccess: (_, { id }) => invalidateUserQueries(queryClient, id),
  });
};

/** Hapus user berdasarkan ID */
export const useDeleteAdminUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => AdminAPI.deleteUser(id),
    onSuccess: () => invalidateUserQueries(queryClient),
  });
};
