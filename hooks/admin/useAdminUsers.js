import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminAPI } from '@/lib/api/admin';

export const adminUserKeys = {
  all: ['admin', 'users'],
  lists: () => [...adminUserKeys.all, 'list'],
  list: (filters) => [...adminUserKeys.lists(), filters],
  details: () => [...adminUserKeys.all, 'detail'],
  detail: (id) => [...adminUserKeys.details(), id],
};

export const useAdminUsers = (filters) => {
  return useQuery({
    queryKey: adminUserKeys.list(filters),
    queryFn: async () => {
      const response = await AdminAPI.getUsers(filters);
      // Contains data and meta (pagination info)
      return response; 
    },
    keepPreviousData: true,
  });
};

export const useCreateAdminUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => AdminAPI.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] }); // Invalidates dashboard
    },
  });
};

export const useUpdateAdminUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => AdminAPI.updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminUserKeys.detail(variables.id) });
    },
  });
};

export const useDeleteAdminUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => AdminAPI.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] }); // Invalidates dashboard
    },
  });
};
