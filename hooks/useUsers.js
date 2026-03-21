import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/lib/api/api";

// Query Keys
export const adminUserKeys = {
  all: ["admin", "users"],
  lists: () => [...adminUserKeys.all, "list"],
  list: (filters) => [...adminUserKeys.lists(), filters],
  details: () => [...adminUserKeys.all, "detail"],
  detail: (id) => [...adminUserKeys.details(), id],
};

export const leaderboardKeys = {
  all: ["user", "leaderboard"],
};

export const userRankKeys = {
  all: ["user", "rank"],
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
    queryFn: () => API.getUsers(filters),
    // placeholderData menggantikan keepPreviousData (deprecated di v5)
    placeholderData: (prev) => prev,
  });
};

/** Buat user baru */
export const useCreateAdminUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => API.createUser(data),
    onSuccess: () => invalidateUserQueries(queryClient),
  });
};

/** Update data user berdasarkan ID */
export const useUpdateAdminUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => API.updateUser(id, data),
    onSuccess: (_, { id }) => invalidateUserQueries(queryClient, id),
  });
};

/** Hapus user berdasarkan ID */
export const useDeleteAdminUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => API.deleteUser(id),
    onSuccess: () => invalidateUserQueries(queryClient),
  });
};

export const useUserRanks = () => {
  return useQuery({
    queryKey: leaderboardKeys.all,
    queryFn: () => API.getLeaderboard(),
  });
};

/** Check username availability with debounce */
const usernameCheckKeys = {
  all: ["user", "check-username"],
  check: (username) => [...usernameCheckKeys.all, username],
};

export const useCheckUsername = (username, enabled = true) => {
  return useQuery({
    queryKey: usernameCheckKeys.check(username),
    queryFn: () => API.checkUsername(username),
    enabled: enabled && !!username && username.length >= 3,
    staleTime: 1000 * 60 * 5, // 5 menit
    gcTime: 1000 * 60 * 10, // 10 menit
  });
};

/** Get user's rank in leaderboard */
export const useUserRank = () => {
  return useQuery({
    queryKey: userRankKeys.all,
    queryFn: () => API.getUserRank(),
    staleTime: 1000 * 60 * 5, // 5 menit
    gcTime: 1000 * 60 * 10, // 10 menit
  });
};
