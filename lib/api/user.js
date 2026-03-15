import api from "./axios";

export const UserAPI = {
  // Missions
  getMissions: () => api.get("/user/missions"),
  getMission: (id) => api.get(`/user/missions/${id}`),
  completeMission: (id, performanceScore) =>
    api.post(`/user/missions/${id}/complete`, { performanceScore }),

  // Shop Items (User)
  getShopItems: () => api.get("/user/shop-items"),
  purchaseShopItem: (id) => api.post(`/user/shop-items/${id}/purchase`, {}),

  // User Items (Owned)
  getUserItems: () => api.get("/user/items"),

  // Events
  getActiveEvents: () => api.get("/events/active"),
};
