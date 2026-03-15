import { useQuery } from "@tanstack/react-query";
import { API } from "@/lib/api/api";

export const userBadgesKeys = {
  all: ["user", "badges"],
  list: () => [...userBadgesKeys.all],
};

export const useUserBadges = () => {
  return useQuery({
    queryKey: userBadgesKeys.list(),
    queryFn: async () => {
      const response = await API.getUserBadges();
      // Axios interceptor unwraps { success: true, data } → { data: {...}, ... }
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (badges don't change often)
    gcTime: 20 * 60 * 1000, // 20 minutes
  });
};
