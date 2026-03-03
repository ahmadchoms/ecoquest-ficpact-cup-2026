import api from "./axios";

export const authAPI = {
  register: (payload) => api.post("/auth/register", payload),
  forgot_password: (payload) => api.post("/auth/forgot-password", payload),
  reset_password: (payload) => api.post("/auth/reset-password", payload),
};