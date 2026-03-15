import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/lib/api/api";
import { API } from "@/lib/api/api";

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
      const response = await API.getBadges(filters);
      const response = await API.getBadges(filters);
      return response;
    },
    placeholderData: (prev) => prev,
  });
};

export const useBadge = (id) => {
  return useQuery({
    queryKey: adminBadgeKeys.detail(id),
    queryFn: async () => {
      const response = await API.getBadge(id);
      const response = await API.getBadge(id);
      return response?.data;
    },
    enabled: !!id,
  });
};

export const useCreateAdminBadge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => API.createBadge(data),
    mutationFn: (data) => API.createBadge(data),
    onSuccess: () => invalidateBadgeQueries(queryClient),
  });
};

export const useUpdateAdminBadge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => API.updateBadge(id, data),
    onSuccess: (_, variables) =>
      invalidateBadgeQueries(queryClient, variables.id),
  });
};

export const useDeleteAdminBadge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => API.deleteBadge(id),
    mutationFn: (id) => API.deleteBadge(id),
    onSuccess: () => invalidateBadgeQueries(queryClient),
  });
};
