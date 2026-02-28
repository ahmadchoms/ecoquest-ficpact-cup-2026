import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminAPI } from '@/lib/api/admin';

export const adminMissionKeys = {
  all: ['admin', 'missions'],
  lists: () => [...adminMissionKeys.all, 'list'],
  list: (filters) => [...adminMissionKeys.lists(), filters],
  details: () => [...adminMissionKeys.all, 'detail'],
  detail: (id) => [...adminMissionKeys.details(), id],
};

export const useAdminMissions = (filters) => {
  return useQuery({
    queryKey: adminMissionKeys.list(filters),
    queryFn: async () => {
      const response = await AdminAPI.getMissions(filters);
      return response; 
    },
    keepPreviousData: true,
  });
};

export const useCreateAdminMission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => AdminAPI.createMission(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminMissionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] }); // Invalidates dashboard
    },
  });
};

export const useUpdateAdminMission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => AdminAPI.updateMission(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminMissionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminMissionKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] }); // Invalidates dashboard status potentially
    },
  });
};

export const useDeleteAdminMission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => AdminAPI.deleteMission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminMissionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] }); // Invalidates dashboard
    },
  });
};
