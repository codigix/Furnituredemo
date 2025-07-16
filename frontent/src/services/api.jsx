// api.jsx
import axios from "axios";

// Get the JWT that you saved after login
const token = localStorage.getItem("token");

// Create a pre‑configured Axios instance
const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

export default api;
