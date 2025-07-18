import { apiService } from "./api";

export const productService = {
  getProducts: async () => {
    const { data } = await apiService.get("/products");
    return data;
  },
  getProductById: async (id) => {
    const { data } = await apiService.get(`/products/${id}`);
    return data;
  },
  createProduct: async (productData) => {
    const { data } = await apiService.post("/products", productData);
    return data;
  },
  updateProduct: async (id, productData) => {
    const { data } = await apiService.put(`/products/${id}`, productData);
    return data;
  },
  deleteProduct: async (id) => {
    const { data } = await apiService.delete(`/products/${id}`);
    return data;
  },
};
