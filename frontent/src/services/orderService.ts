
import { apiService } from './api';
import { Product } from './productService';

export interface OrderItem {
  name: string;
  quantity: number;
  image: string;
  price: number;
  product: string;
}

export interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  total: number;
  status: 'pending' | 'shipped' | 'delivered';
  createdAt: string;
  updatedAt: string;
}

export interface OrderResponse {
  success: boolean;
  order: Order;
}

export interface OrdersResponse {
  success: boolean;
  count: number;
  orders: Order[];
}

export const orderService = {
  /**
   * Create a new order
   */
  createOrder: async (orderData: {
    items: OrderItem[];
    shippingAddress: ShippingAddress;
    total: number;
  }): Promise<OrderResponse> => {
    return apiService.post<OrderResponse>('/orders', orderData);
  },

  /**
   * Get order by ID
   */
  getOrderById: async (id: string): Promise<OrderResponse> => {
    return apiService.get<OrderResponse>(`/orders/${id}`);
  },

  /**
   * Get all orders for current user
   */
  getUserOrders: async (): Promise<OrdersResponse> => {
    return apiService.get<OrdersResponse>('/orders/myorders');
  },

  /**
   * Get all orders (admin only)
   */
  getAllOrders: async (): Promise<OrdersResponse> => {
    return apiService.get<OrdersResponse>('/orders');
  },

  /**
   * Update order status (admin only)
   */
  updateOrderStatus: async (
    id: string,
    status: 'pending' | 'shipped' | 'delivered'
  ): Promise<OrderResponse> => {
    return apiService.put<OrderResponse>(`/orders/${id}/status`, { status });
  }
};
