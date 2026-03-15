import { useQuery } from "@tanstack/react-query";
import { UserAPI } from "@/lib/api/user";

export const userDashboardKeys = {
  all: ["user", "dashboard"],
  dashboard: () => [...userDashboardKeys.all],
};

export const useDashboard = () => {
  return useQuery({
    queryKey: userDashboardKeys.dashboard(),
    queryFn: async () => {
      const response = await UserAPI.getDashboard();
      // Axios interceptor unwraps { success: true, data } → { data: {...}, ... }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};
