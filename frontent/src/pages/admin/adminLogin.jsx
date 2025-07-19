// AdminLoginPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE = process.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* ⏩  If the admin already has a token, jump straight to the dashboard */
  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      navigate("/admin/products", { replace: true });
    }
  }, [navigate]);

  /* 🔐  Handle login */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, status } = await axios.post(
        `${API_BASE}/admin/login`,
        { email, password },
        { withCredentials: true }           // keep if your backend sets cookies
      );

      if (status === 200 && data.success) {
        localStorage.setItem("authToken", data.token);          // JWT
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Login successful!");

        navigate("/admin/products", { replace: true });
      } else {
        toast.error("Invalid credentials");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Server error";
      toast.error(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------- UI ------------------------------ */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-6 border border-gray-300 rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in…" : "Login"}
        </button>
      </form>
    </div>
  );
}
