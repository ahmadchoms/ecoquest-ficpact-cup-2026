import api from "./axios";

const getHeaders = (data) => {
  if (data instanceof FormData) {
    return { "Content-Type": "multipart/form-data" };
  }
  return { "Content-Type": "application/json" };
};

export const API = {
  register: (payload) => api.post("/auth/register", payload),
  forgot_password: (payload) => api.post("/auth/forgot-password", payload),
  reset_password: (payload) => api.post("/auth/reset-password", payload),

  getNavbarData: () => api.get("/user/navbar"),
  getMissions: (params) => api.get("/user/missions", { params }),
  getMission: (id) => api.get(`/user/missions/${id}`),
  completeMission: (id, performanceScore) =>
    api.post(`/user/missions/${id}/complete`, { performanceScore }),
  getShopItems: () => api.get("/user/shop-items"),
  getPurchasedShopItems: () => api.get("/user/shop-items/owned"),
  purchaseShopItem: (id) => api.post(`/user/shop-items/${id}/purchase`, {}),
  getUserItems: () => api.get("/user/items"),
  updateUserItems: (data) => api.put("/user/items", data),
  getActiveEvents: () => api.get("/events/active"),
  getDashboard: () => api.get("/user/dashboard"),
  getProfile: () => api.get("/user/profile"),
  updateProfile: (data) => api.patch("/user/profile", data),
  checkUsername: (username) => api.post("/user/check-username", { username }),
  getUserBadges: () => api.get("/user/badges"),
  getStats: () => api.get("/user/stats"),
  getLeaderboard: () => api.get("/user/leaderboard"),
  getUserRank: () => api.get("/user/rank"),

  getAdminStats: () => api.get("/admin/stats"),
  getActivities: () => api.get("/admin/activities"),
  getAnalytics: (params) => api.get("/admin/analytics", { params }),

  getUsers: (params) => api.get("/admin/users", { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  createUser: (data) =>
    api.post("/admin/users", data, { headers: getHeaders(data) }),
  updateUser: (id, data) =>
    api.patch(`/admin/users/${id}`, data, { headers: getHeaders(data) }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),

  getProvinces: (params) => api.get("/admin/provinces", { params }),
  getProvince: (id) => api.get(`/admin/provinces/${id}`),
  updateProvince: (id, data) =>
    api.patch(`/admin/provinces/${id}`, data, { headers: getHeaders(data) }),
  deleteProvince: (id) => api.delete(`/admin/provinces/${id}`),

  getAdminMissions: (params) => api.get("/admin/missions", { params }),
  getAdminMission: (id) => api.get(`/admin/missions/${id}`),
  createMission: (data) =>
    api.post("/admin/missions", data, { headers: getHeaders(data) }),
  updateMission: (id, data) =>
    api.patch(`/admin/missions/${id}`, data, { headers: getHeaders(data) }),
  deleteMission: (id) => api.delete(`/admin/missions/${id}`),

  getBadges: (params) => api.get("/admin/badges", { params }),
  getBadge: (id) => api.get(`/admin/badges/${id}`),
  createBadge: (data) =>
    api.post("/admin/badges", data, { headers: getHeaders(data) }),
  updateBadge: (id, data) =>
    api.patch(`/admin/badges/${id}`, data, { headers: getHeaders(data) }),
  deleteBadge: (id) => api.delete(`/admin/badges/${id}`),

  getEvents: (params) => api.get("/admin/events", { params }),
  getEvent: (id) => api.get(`/admin/events/${id}`),
  createEvent: (data) =>
    api.post("/admin/events", data, { headers: getHeaders(data) }),
  updateEvent: (id, data) =>
    api.patch(`/admin/events/${id}`, data, { headers: getHeaders(data) }),
  deleteEvent: (id) => api.delete(`/admin/events/${id}`),

  getAdminShopItems: (params) => api.get("/admin/shop-items", { params }),
  getAdminShopItem: (id) => api.get(`/admin/shop-items/${id}`),
  createShopItem: (data) =>
    api.post("/admin/shop-items", data, { headers: getHeaders(data) }),
  updateShopItem: (id, data) =>
    api.patch(`/admin/shop-items/${id}`, data, { headers: getHeaders(data) }),
  deleteShopItem: (id) => api.delete(`/admin/shop-items/${id}`),
};
