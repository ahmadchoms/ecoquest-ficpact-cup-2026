import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/lib/api/api";

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
      const response = await API.getProvinces(filters);
      return response;
    },
    placeholderData: (prev) => prev,
  });
};

export const useProvince = (id) => {
  return useQuery({
    queryKey: adminProvinceKeys.detail(id),
    queryFn: async () => {
      const response = await API.getProvince(id);
      return response?.data;
    },
    enabled: !!id,
  });
};

export const useUpdateAdminProvince = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => API.updateProvince(id, data),
    onSuccess: (_, variables) =>
      invalidateProvinceQueries(queryClient, variables.id),
  });
};

export const useDeleteAdminProvince = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => API.deleteProvince(id),
    onSuccess: () => invalidateProvinceQueries(queryClient),
  });
};
