import api from "./axios";

// Helper to determine headers based on payload type
const getHeaders = (data) => {
  if (data instanceof FormData) {
    // Let browser auto-set Content-Type with boundary for FormData
    return { "Content-Type": "multipart/form-data" };
  }
  return { "Content-Type": "application/json" };
};

export const AdminAPI = {
  // Statistics & Dashboard
  getStats: () => api.get("/admin/stats"),
  getActivities: () => api.get("/admin/activities"),
  getAnalytics: (params) => api.get("/admin/analytics", { params }),

  // Users
  getUsers: (params) => api.get("/admin/users", { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  createUser: (data) => api.post("/admin/users", data, { headers: getHeaders(data) }),
  updateUser: (id, data) => api.patch(`/admin/users/${id}`, data, { headers: getHeaders(data) }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),

  // Provinces
  getProvinces: (params) => api.get("/admin/provinces", { params }),
  getProvince: (id) => api.get(`/admin/provinces/${id}`),
  createProvince: (data) => api.post("/admin/provinces", data, { headers: getHeaders(data) }),
  updateProvince: (id, data) => api.patch(`/admin/provinces/${id}`, data, { headers: getHeaders(data) }),
  deleteProvince: (id) => api.delete(`/admin/provinces/${id}`),

  // Missions
  getMissions: (params) => api.get("/admin/missions", { params }),
  getMission: (id) => api.get(`/admin/missions/${id}`),
  createMission: (data) => api.post("/admin/missions", data, { headers: getHeaders(data) }),
  updateMission: (id, data) => api.patch(`/admin/missions/${id}`, data, { headers: getHeaders(data) }),
  deleteMission: (id) => api.delete(`/admin/missions/${id}`),

  // Badges
  getBadges: (params) => api.get("/admin/badges", { params }),
  getBadge: (id) => api.get(`/admin/badges/${id}`),
  createBadge: (data) => api.post("/admin/badges", data, { headers: getHeaders(data) }),
  updateBadge: (id, data) => api.patch(`/admin/badges/${id}`, data, { headers: getHeaders(data) }),
  deleteBadge: (id) => api.delete(`/admin/badges/${id}`),

  // Events
  getEvents: (params) => api.get("/admin/events", { params }),
  getEvent: (id) => api.get(`/admin/events/${id}`),
  createEvent: (data) => api.post("/admin/events", data, { headers: getHeaders(data) }),
  updateEvent: (id, data) => api.patch(`/admin/events/${id}`, data, { headers: getHeaders(data) }),
  deleteEvent: (id) => api.delete(`/admin/events/${id}`),

  // Shop Items
  getShopItems: (params) => api.get("/admin/shop-items", { params }),
  getShopItem: (id) => api.get(`/admin/shop-items/${id}`),
  createShopItem: (data) => api.post("/admin/shop-items", data, { headers: getHeaders(data) }),
  updateShopItem: (id, data) => api.patch(`/admin/shop-items/${id}`, data, { headers: getHeaders(data) }),
  deleteShopItem: (id) => api.delete(`/admin/shop-items/${id}`),
};
