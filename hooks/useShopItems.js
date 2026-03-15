import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/lib/api/api";

export const adminShopItemKeys = {
  all: ["admin", "shopItems"],
  lists: () => [...adminShopItemKeys.all, "list"],
  list: (filters) => [...adminShopItemKeys.lists(), filters],
  details: () => [...adminShopItemKeys.all, "detail"],
  detail: (id) => [...adminShopItemKeys.details(), id],
};

const invalidateShopItemQueries = (queryClient, id = null) => {
  queryClient.invalidateQueries({ queryKey: adminShopItemKeys.lists() });
  if (id) {
    queryClient.invalidateQueries({ queryKey: adminShopItemKeys.detail(id) });
  }
};

export const useShopItems = (filters) => {
  return useQuery({
    queryKey: adminShopItemKeys.list(filters),
    queryFn: async () => {
      const response = await API.getShopItems(filters);
      return response;
    },
    placeholderData: (prev) => prev,
  });
};

export const useEventOptions = () => {
  return useQuery({
    queryKey: ["admin", "events", "options"],
    queryFn: async () => {
      // Get all active events for dropdowns
      const response = await API.getEvents({ limit: 100, isActive: true });
      const events = response?.data || [];
      return events.map((ev) => ({
        label: ev.name,
        value: ev.id,
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateAdminShopItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => API.createShopItem(data),
    onSuccess: () => invalidateShopItemQueries(queryClient),
  });
};

export const useUpdateAdminShopItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => API.updateShopItem(id, data),
    onSuccess: (_, variables) =>
      invalidateShopItemQueries(queryClient, variables.id),
  });
};

export const useDeleteAdminShopItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => API.deleteShopItem(id),
    onSuccess: () => invalidateShopItemQueries(queryClient),
  });
};
