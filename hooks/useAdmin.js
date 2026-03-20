import { useQuery } from "@tanstack/react-query";
import { API } from "@/lib/api/api";

export const adminQueryKeys = {
  stats: ["admin", "stats"],
  activities: ["admin", "activities"],
};

export const useAdmin = () => {
  const statsQuery = useQuery({
    queryKey: adminQueryKeys.stats,
    queryFn: async () => {
      const { data } = await API.getAdminStats();
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes fresh
  });

  const activitiesQuery = useQuery({
    queryKey: adminQueryKeys.activities,
    queryFn: async () => {
      const { data } = await API.getActivities();
      return data;
    },
    staleTime: 1000 * 60, // 1 minute
  });

  return {
    stats: statsQuery.data,
    activities: activitiesQuery.data,
    isLoading: statsQuery.isLoading || activitiesQuery.isLoading,
    isError: statsQuery.isError || activitiesQuery.isError,
    error: statsQuery.error || activitiesQuery.error,
    refetch: () => {
      statsQuery.refetch();
      activitiesQuery.refetch();
    },
  };
};
