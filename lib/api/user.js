import api from "./axios";

export const UserAPI = {
  // Dashboard
  getDashboard: () => api.get("/user/dashboard"),
  
  // Profile
  getProfile: () => api.get("/user/profile"),
  updateProfile: (data) => api.patch("/user/profile", data),
  
  // Badges
  getBadges: () => api.get("/user/badges"),
  
  // Stats
  getStats: () => api.get("/user/stats"),
  
  // Missions
  getMissions: (params) => api.get("/user/missions", { params }),
  completeMission: (missionId, data) => api.post(`/user/missions/${missionId}`, data),
  
  // XP & Points
  addXP: (data) => api.post("/user/xp", data),
};
