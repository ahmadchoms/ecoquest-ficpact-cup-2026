import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/lib/api/api";

export const userItemsKeys = {
  all: ["userItems"],
  items: () => ["userItems", "items"],
};

/**
 * Fetch user's owned items (banners, borders) grouped by type
 */
export const useUserItems = () => {
  return useQuery({
    queryKey: userItemsKeys.items(),
    queryFn: async () => {
      const response = await API.getUserItems();
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });
};

/**
 * Mutation to update user's active banner and border selections
 */
export const useUpdateUserItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await API.updateUserItems(data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate items query to refetch
      queryClient.invalidateQueries({ queryKey: userItemsKeys.items() });
    },
  });
};
