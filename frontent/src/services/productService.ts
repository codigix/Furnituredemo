
import { apiService } from './api';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  count: number;
  products: Product[];
}

export interface ProductResponse {
  success: boolean;
  product: Product;
}

export const productService = {
  /**
   * Get all products
   */
  getProducts: async (): Promise<ProductsResponse> => {
    return apiService.get<ProductsResponse>('/products');
  },

  /**
   * Get product details by ID
   */
  getProductById: async (id: string): Promise<ProductResponse> => {
    return apiService.get<ProductResponse>(`/products/${id}`);
  },

  /**
   * Create a new product (admin only)
   */
  createProduct: async (productData: {
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    stock: number;
  }): Promise<ProductResponse> => {
    return apiService.post<ProductResponse>('/products', productData);
  },

  /**
   * Update a product (admin only)
   */
  updateProduct: async (
    id: string,
    productData: Partial<{
      name: string;
      description: string;
      price: number;
      image: string;
      category: string;
      stock: number;
    }>
  ): Promise<ProductResponse> => {
    return apiService.put<ProductResponse>(`/products/${id}`, productData);
  },

  /**
   * Delete a product (admin only)
   */
  deleteProduct: async (id: string): Promise<{ success: boolean; message: string }> => {
    return apiService.delete<{ success: boolean; message: string }>(`/products/${id}`);
  }
};
