import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminAPI } from '@/lib/api/admin';

export const adminProvinceKeys = {
  all: ['admin', 'provinces'],
  lists: () => [...adminProvinceKeys.all, 'list'],
  list: (filters) => [...adminProvinceKeys.lists(), filters],
  details: () => [...adminProvinceKeys.all, 'detail'],
  detail: (id) => [...adminProvinceKeys.details(), id],
};

export const useAdminProvinces = (filters) => {
  return useQuery({
    queryKey: adminProvinceKeys.list(filters),
    queryFn: async () => {
      const response = await AdminAPI.getProvinces(filters);
      return response; 
    },
    keepPreviousData: true,
  });
};

export const useCreateAdminProvince = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => AdminAPI.createProvince(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminProvinceKeys.lists() });
    },
  });
};

export const useUpdateAdminProvince = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => AdminAPI.updateProvince(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminProvinceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminProvinceKeys.detail(variables.id) });
    },
  });
};

export const useDeleteAdminProvince = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => AdminAPI.deleteProvince(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminProvinceKeys.lists() });
    },
  });
};
