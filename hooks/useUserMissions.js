import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/lib/api/api";

export const userMissionKeys = {
  all: ["user", "missions"],
  lists: () => [...userMissionKeys.all, "list"],
  details: () => [...userMissionKeys.all, "detail"],
  detail: (id) => [...userMissionKeys.details(), id],
};

export const userShopKeys = {
  all: ["user", "shop"],
  shopItems: () => [...userShopKeys.all, "items"],
  userItems: () => [...userShopKeys.all, "userItems"],
};

import { navbarKeys } from "./useNavbarData";
import { userDashboardKeys } from "./useDashboard";

const invalidateMissionQueries = (queryClient) => {
  queryClient.invalidateQueries({ queryKey: userMissionKeys.lists() });
  // Invalidate dashboard so Zustand syncs with fresh data
  queryClient.invalidateQueries({ queryKey: userDashboardKeys.dashboard() });
};

const invalidateShopQueries = (queryClient) => {
  queryClient.invalidateQueries({ queryKey: userShopKeys.shopItems() });
  queryClient.invalidateQueries({ queryKey: userShopKeys.userItems() });
  // Invalidate navbar to fetch fresh points from database
  queryClient.invalidateQueries({ queryKey: navbarKeys.stats() });
  // Invalidate dashboard so Zustand syncs with fresh data after purchase
  queryClient.invalidateQueries({ queryKey: userDashboardKeys.dashboard() });
};

// === MISSIONS HOOKS ===
export const useUserMissions = () => {
  return useQuery({
    queryKey: userMissionKeys.lists(),
    queryFn: async () => {
      const response = await API.getMissions();
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useUserMission = (id) => {
  return useQuery({
    queryKey: userMissionKeys.detail(id),
    queryFn: async () => {
      const response = await API.getMission(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCompleteMission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ missionId, performanceScore }) =>
      API.completeMission(missionId, performanceScore),
    onSuccess: () => {
      invalidateMissionQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: navbarKeys.stats() });
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
    },
  });
};

// === SHOP ITEMS HOOKS ===
export const useAvailableShopItems = () => {
  return useQuery({
    queryKey: userShopKeys.shopItems(),
    queryFn: async () => {
      const response = await API.getShopItems();
      return response.data || [];
    },
    staleTime: 0, // Set ke 0 agar tidak cache terlalu lama, refetch lebih sering
    gcTime: 1000 * 60 * 10, // Keep cache for 10 minutes
  });
};

export const useUserShopItems = () => {
  return useQuery({
    queryKey: userShopKeys.userItems(),
    queryFn: async () => {
      const response = await API.getPurchasedShopItems();
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const usePurchaseShopItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId) => API.purchaseShopItem(itemId),
    onSuccess: () => {
      invalidateShopQueries(queryClient);
      // Invalidate user profile/stats data if needed
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
    },
  });
};
