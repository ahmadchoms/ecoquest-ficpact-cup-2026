import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserAPI } from "@/lib/api/user";

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

const invalidateMissionQueries = (queryClient) => {
  queryClient.invalidateQueries({ queryKey: userMissionKeys.lists() });
};

const invalidateShopQueries = (queryClient) => {
  queryClient.invalidateQueries({ queryKey: userShopKeys.shopItems() });
  queryClient.invalidateQueries({ queryKey: userShopKeys.userItems() });
  // Invalidate navbar to fetch fresh points from database
  queryClient.invalidateQueries({ queryKey: navbarKeys.stats() });
};

// === MISSIONS HOOKS ===
export const useUserMissions = () => {
  return useQuery({
    queryKey: userMissionKeys.lists(),
    queryFn: async () => {
      const response = await UserAPI.getMissions();
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useUserMission = (id) => {
  return useQuery({
    queryKey: userMissionKeys.detail(id),
    queryFn: async () => {
      const response = await UserAPI.getMission(id);
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
      UserAPI.completeMission(missionId, performanceScore),
    onSuccess: () => {
      invalidateMissionQueries(queryClient);
      // Invalidate user profile/stats data if needed
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
    },
  });
};

// === SHOP ITEMS HOOKS ===
export const useAvailableShopItems = () => {
  return useQuery({
    queryKey: userShopKeys.shopItems(),
    queryFn: async () => {
      const response = await UserAPI.getShopItems();
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
      const response = await UserAPI.getUserItems();
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const usePurchaseShopItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId) => UserAPI.purchaseShopItem(itemId),
    onSuccess: () => {
      invalidateShopQueries(queryClient);
      // Invalidate user profile/stats data if needed
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
    },
  });
};
