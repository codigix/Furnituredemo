// App.jsx
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";

import { store } from "./store";
import { getUserProfile } from "./store/authSlice";
import { useAppDispatch } from "./hooks/useAppDispatch";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage"
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserProfilePage from "./pages/UserProfilePage";
import OrdersPage from "./pages/OrdersPage";

// Admin Pages
import AdminLoginPage from "./pages/admin/adminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOrders from "./pages/admin/AdminOrders";
import ProductsPage from "./pages/ProductsPage";

const queryClient = new QueryClient();

// Auth initializer component
const AuthInitializer = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(getUserProfile());
    }
  }, [dispatch]);

  return children;
};

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <AuthInitializer>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/:id" element={<ProductDetail />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />

                {/* Protected User Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="checkout" element={<CheckoutPage />} />
                  <Route path="profile" element={<UserProfilePage />} />
                  <Route path="orders" element={<OrdersPage />} />
                </Route>

                {/* Public Admin Login */}
                <Route path="admin" element={<AdminLoginPage />} />
                <Route path="/admin/login" element={<LoginPage />} />
                {/* <Route path="/admin/login/products" element={<AdminProducts />} /> */}

                {/* Protected Admin Routes */}
                <Route element={<AdminRoute />}>
                  <Route path="admin/dashboard" element={<AdminDashboard />} />
                  <Route path="admin/products" element={<AdminProducts />} />
                  <Route path="admin/users" element={<AdminUsers />} />
                  <Route path="admin/orders" element={<AdminOrders />} />

                </Route>

                {/* Fallback Route */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </AuthInitializer>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
