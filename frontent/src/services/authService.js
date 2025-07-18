import apiService from "./api"; // ✅ Use default export (recommended)

// Define methods
const login = async (email, password) => {
  const res = await apiService.post("/users/login", { email, password }); 
  return res.data;
};

const googleAuth = async (tokenId) => {
  const res = await apiService.post("/users/google", { tokenId });
  return res.data;
};

const register = async (name, email, password) => {
  const res = await apiService.post("/users/register", { name, email, password });
  return res.data;
};

const getUserProfile = async () => {
  const res = await apiService.get("/users/profile");
  return res.data;
};

const updateUserProfile = async (userData) => {
  const res = await apiService.put("/users/profile", userData);
  return res.data;
};

const logout = () => {
  localStorage.removeItem("token");
};

// ✅ Export as an object
export const authService = {
  login,
  googleAuth,
  register,
  getUserProfile,
  updateUserProfile,
  logout,
};
