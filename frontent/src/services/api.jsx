import axios from "axios";

export const apiService = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

// ✅ Attach token automatically
apiService.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiService;
