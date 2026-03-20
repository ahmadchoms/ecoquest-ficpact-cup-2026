import axios from "axios";

// Creates a pre-configured Axios instance for calling our Next.js API Routes
const api = axios.create({
  baseURL: "/api",
});

// Request interceptor - smart Content-Type handling for FormData vs JSON
api.interceptors.request.use((config) => {
  // If data is FormData, let axios auto-set multipart/form-data
  if (!(config.data instanceof FormData)) {
    // For JSON, explicitly set Content-Type
    config.headers["Content-Type"] = "application/json";
  }
  // For FormData, don't set Content-Type - axios will auto-set with boundary
  return config;
});

// Response interceptor to easily unwrap { success, data, error } format
api.interceptors.response.use(
  (response) => {
    // If the API returns a generic { success: true, data: ... } we unwrap it early
    if (response.data && response.data.success && response.data.data !== undefined) {
      return {
        data: response.data.data,
        meta: response.data.meta, // Preserve pagination meta if exists
        status: response.status,
      };
    }
    return response;
  },
  (error) => {
    let message = "Unknown error occurred";
    
    if (error.response?.data?.error) {
      message = typeof error.response.data.error === "string" 
        ? error.response.data.error 
        : error.response.data.error.message || "Server error";
    } else if (error.message) {
      message = error.message;
    }
    
    return Promise.reject(new Error(message));
  }
);

export default api;
