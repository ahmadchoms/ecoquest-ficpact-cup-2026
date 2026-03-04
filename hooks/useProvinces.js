import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminAPI } from "@/lib/api/admin";

export const adminProvinceKeys = {
  all: ["admin", "provinces"],
  lists: () => [...adminProvinceKeys.all, "list"],
  list: (filters) => [...adminProvinceKeys.lists(), filters],
  details: () => [...adminProvinceKeys.all, "detail"],
  detail: (id) => [...adminProvinceKeys.details(), id],
};

const invalidateProvinceQueries = (queryClient, id = null) => {
  queryClient.invalidateQueries({ queryKey: adminProvinceKeys.lists() });
  queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
  if (id) {
    queryClient.invalidateQueries({ queryKey: adminProvinceKeys.detail(id) });
  }
};

export const useProvinces = (filters) => {
  return useQuery({
    queryKey: adminProvinceKeys.list(filters),
    queryFn: async () => {
      const response = await AdminAPI.getProvinces(filters);
      return response;
    },
    placeholderData: (prev) => prev,
  });
};

export const useCreateAdminProvince = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => AdminAPI.createProvince(data),
    onSuccess: () => invalidateProvinceQueries(queryClient),
  });
};

export const useUpdateAdminProvince = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => AdminAPI.updateProvince(id, data),
    onSuccess: (_, variables) =>
      invalidateProvinceQueries(queryClient, variables.id),
  });
};

export const useDeleteAdminProvince = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => AdminAPI.deleteProvince(id),
    onSuccess: () => invalidateProvinceQueries(queryClient),
  });
};
