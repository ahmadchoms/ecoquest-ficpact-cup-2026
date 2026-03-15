import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminAPI } from "@/lib/api/admin";

export const adminBadgeKeys = {
  all: ["admin", "badges"],
  lists: () => [...adminBadgeKeys.all, "list"],
  list: (filters) => [...adminBadgeKeys.lists(), filters],
  details: () => [...adminBadgeKeys.all, "detail"],
  detail: (id) => [...adminBadgeKeys.details(), id],
};

const invalidateBadgeQueries = (queryClient, id = null) => {
  queryClient.invalidateQueries({ queryKey: adminBadgeKeys.lists() });
  queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
  if (id) {
    queryClient.invalidateQueries({ queryKey: adminBadgeKeys.detail(id) });
  }
};

export const useBadges = (filters) => {
  return useQuery({
    queryKey: adminBadgeKeys.list(filters),
    queryFn: async () => {
      const response = await AdminAPI.getBadges(filters);
      return response;
    },
    placeholderData: (prev) => prev,
  });
};

export const useBadge = (id) => {
  return useQuery({
    queryKey: adminBadgeKeys.detail(id),
    queryFn: async () => {
      const response = await AdminAPI.getBadge(id);
      return response?.data;
    },
    enabled: !!id,
  });
};

export const useCreateAdminBadge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => AdminAPI.createBadge(data),
    onSuccess: () => invalidateBadgeQueries(queryClient),
  });
};

export const useUpdateAdminBadge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => AdminAPI.updateBadge(id, data),
    onSuccess: (_, variables) => invalidateBadgeQueries(queryClient, variables.id),
  });
};

export const useDeleteAdminBadge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => AdminAPI.deleteBadge(id),
    onSuccess: () => invalidateBadgeQueries(queryClient),
  });
};
