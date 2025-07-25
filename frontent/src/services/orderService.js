import { apiService } from "./api";

const orderService = {
  /**
   * Create a new order
   */
  createOrder: async (orderData) => {
    return apiService.post("/orders", orderData);
  },

  /**
   * Get order by ID
   */
  getOrderById: async (id) => {
    return apiService.get(`/orders/${id}`);
  },

  /**
   * Get all orders for current user
   */
  getUserOrders: async () => {
    return apiService.get("/orders/myorders");
  },

  /**
   * Get all orders (admin only)
   */
  getAllOrders: async () => {
    return apiService.get("/orders");
  },

  /**
   * Update order status (admin only)
   */
  updateOrderStatus: async (id, status) => {
    return apiService.put(`/orders/${id}/status`, { status });
  },
};

export default orderService;
