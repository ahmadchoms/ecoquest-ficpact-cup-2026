import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminAPI } from "@/lib/api/admin";

export const adminMissionKeys = {
  all: ["admin", "missions"],
  lists: () => [...adminMissionKeys.all, "list"],
  list: (filters) => [...adminMissionKeys.lists(), filters],
  details: () => [...adminMissionKeys.all, "detail"],
  detail: (id) => [...adminMissionKeys.details(), id],
};

const invalidateMissionQueries = (queryClient, id = null) => {
  queryClient.invalidateQueries({ queryKey: adminMissionKeys.lists() });
  queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
  if (id) {
    queryClient.invalidateQueries({ queryKey: adminMissionKeys.detail(id) });
  }
};

export const useMissions = (filters) => {
  return useQuery({
    queryKey: adminMissionKeys.list(filters),
    queryFn: async () => {
      const response = await AdminAPI.getMissions(filters);
      return response;
    },
    placeholderData: (prev) => prev,
  });
};

export const useProvinceOptions = () => {
  return useQuery({
    queryKey: ["admin", "provinces", "options"],
    queryFn: async () => {
      const response = await AdminAPI.getProvinces({ limit: 100 });
      const provinces = response?.data || [];
      return provinces.map((prov) => ({
        label: prov.name,
        value: prov.id,
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useBadgeOptions = () => {
  return useQuery({
    queryKey: ["admin", "badges", "options"],
    queryFn: async () => {
      const response = await AdminAPI.getBadges({ limit: 100 });
      const badges = response?.data || [];
      return badges.map((badge) => ({
        label: `${badge.name} (${badge.rarity})`,
        value: badge.id,
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateAdminMission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => AdminAPI.createMission(data),
    onSuccess: () => invalidateMissionQueries(queryClient),
  });
};

export const useUpdateAdminMission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => AdminAPI.updateMission(id, data),
    onSuccess: (_, variables) =>
      invalidateMissionQueries(queryClient, variables.id),
  });
};

export const useDeleteAdminMission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => AdminAPI.deleteMission(id),
    onSuccess: () => invalidateMissionQueries(queryClient),
  });
};
