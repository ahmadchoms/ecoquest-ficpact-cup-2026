import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/lib/api/api";

export const adminEventKeys = {
  all: ["admin", "events"],
  lists: () => [...adminEventKeys.all, "list"],
  list: (filters) => [...adminEventKeys.lists(), filters],
  details: () => [...adminEventKeys.all, "detail"],
  detail: (id) => [...adminEventKeys.details(), id],
};

const invalidateEventQueries = (queryClient, id = null) => {
  queryClient.invalidateQueries({ queryKey: adminEventKeys.lists() });
  if (id) {
    queryClient.invalidateQueries({ queryKey: adminEventKeys.detail(id) });
  }
};

export const useEvents = (filters) => {
  return useQuery({
    queryKey: adminEventKeys.list(filters),
    queryFn: async () => {
      const response = await API.getEvents(filters);
      return response;
    },
    placeholderData: (prev) => prev,
  });
};

export const useActiveEvents = () => {
  return useQuery({
    queryKey: ["user", "events", "active"],
    queryFn: async () => {
      const response = await API.getActiveEvents();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateAdminEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => API.createEvent(data),
    onSuccess: () => invalidateEventQueries(queryClient),
  });
};

export const useUpdateAdminEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => API.updateEvent(id, data),
    onSuccess: (_, variables) =>
      invalidateEventQueries(queryClient, variables.id),
  });
};

export const useDeleteAdminEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => API.deleteEvent(id),
    onSuccess: () => invalidateEventQueries(queryClient),
  });
};
