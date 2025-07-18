import axios from "axios";

export const apiService = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

// ✅ Attach token automatically
apiService.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("🔗 Attaching token:", token); // ✅ Should NOT be null after login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiService;
