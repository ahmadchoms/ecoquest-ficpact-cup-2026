import api from "./axios";

export const AdminAPI = {
  // Statistics & Dashboard
  getStats: () => api.get("/admin/stats"),
  getActivities: () => api.get("/admin/activities"),
  getAnalytics: (params) => api.get("/admin/analytics", { params }),

  // Users
  getUsers: (params) => api.get("/admin/users", { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  createUser: (data) => api.post("/admin/users", data),
  updateUser: (id, data) => api.patch(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),

  // Provinces
  getProvinces: (params) => api.get("/admin/provinces", { params }),
  getProvince: (id) => api.get(`/admin/provinces/${id}`),
  createProvince: (data) => api.post("/admin/provinces", data),
  updateProvince: (id, data) => api.patch(`/admin/provinces/${id}`, data),
  deleteProvince: (id) => api.delete(`/admin/provinces/${id}`),

  // Missions
  getMissions: (params) => api.get("/admin/missions", { params }),
  getMission: (id) => api.get(`/admin/missions/${id}`),
  createMission: (data) => api.post("/admin/missions", data),
  updateMission: (id, data) => api.patch(`/admin/missions/${id}`, data),
  deleteMission: (id) => api.delete(`/admin/missions/${id}`),

  // Badges
  getBadges: (params) => api.get("/admin/badges", { params }),
  getBadge: (id) => api.get(`/admin/badges/${id}`),
  createBadge: (data) => api.post("/admin/badges", data),
  updateBadge: (id, data) => api.patch(`/admin/badges/${id}`, data),
  deleteBadge: (id) => api.delete(`/admin/badges/${id}`),
};
