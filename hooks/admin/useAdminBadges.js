import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminAPI } from '@/lib/api/admin';

export const adminBadgeKeys = {
  all: ['admin', 'badges'],
  lists: () => [...adminBadgeKeys.all, 'list'],
  list: (filters) => [...adminBadgeKeys.lists(), filters],
  details: () => [...adminBadgeKeys.all, 'detail'],
  detail: (id) => [...adminBadgeKeys.details(), id],
};

export const useAdminBadges = (filters) => {
  return useQuery({
    queryKey: adminBadgeKeys.list(filters),
    queryFn: async () => {
      const response = await AdminAPI.getBadges(filters);
      return response; 
    },
    keepPreviousData: true,
  });
};

export const useCreateAdminBadge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => AdminAPI.createBadge(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminBadgeKeys.lists() });
    },
  });
};

export const useUpdateAdminBadge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => AdminAPI.updateBadge(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminBadgeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminBadgeKeys.detail(variables.id) });
    },
  });
};

export const useDeleteAdminBadge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => AdminAPI.deleteBadge(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminBadgeKeys.lists() });
    },
  });
};
