import { useQuery } from "@tanstack/react-query";
import { API } from "@/lib/api/api";

export const adminAnalyticsKeys = {
  all: ["admin", "analytics"],
  data: (range) => [...adminAnalyticsKeys.all, range],
};

export const useAnalytics = (range = "7d") => {
  return useQuery({
    queryKey: adminAnalyticsKeys.data(range),
    queryFn: async () => {
      const { data } = await API.getAnalytics({ range });
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes fresh
    placeholderData: (prev) => prev,
  });
};
