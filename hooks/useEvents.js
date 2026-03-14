import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminAPI } from "@/lib/api/admin";

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
      const response = await AdminAPI.getEvents(filters);
      return response;
    },
    placeholderData: (prev) => prev,
  });
};

export const useCreateAdminEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => AdminAPI.createEvent(data),
    onSuccess: () => invalidateEventQueries(queryClient),
  });
};

export const useUpdateAdminEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => AdminAPI.updateEvent(id, data),
    onSuccess: (_, variables) =>
      invalidateEventQueries(queryClient, variables.id),
  });
};

export const useDeleteAdminEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => AdminAPI.deleteEvent(id),
    onSuccess: () => invalidateEventQueries(queryClient),
  });
};
