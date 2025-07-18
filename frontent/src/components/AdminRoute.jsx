import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdminRoute() {
  const { user, isLoading } = useSelector((s) => s.auth);

  if (isLoading) return null;                         // still checking token
  if (!user?.isAdmin) return <Navigate to="/admin/login" replace />;

  return <Outlet />;                                   // ✅ authorised
}
