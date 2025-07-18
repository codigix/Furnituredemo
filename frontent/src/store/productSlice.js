import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productService } from "../services/productService";
import { toast } from "sonner";

const initialState = {
  products: [],
  featuredProducts: [],
  currentProduct: null,
  isLoading: false,
  error: null,
};

// ✅ Async Thunks
export const fetchProducts = createAsyncThunk("products/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    const response = await productService.getProducts();
    return response.products;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
  }
});

export const createProduct = createAsyncThunk("products/createProduct", async (productData, { rejectWithValue }) => {
  try {
    const response = await productService.createProduct(productData);
    return response.product;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to create product");
  }
});

export const updateProduct = createAsyncThunk("products/updateProduct", async ({ id, productData }, { rejectWithValue }) => {
  try {
    const response = await productService.updateProduct(id, productData);
    return response.product;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to update product");
  }
});

export const deleteProduct = createAsyncThunk("products/deleteProduct", async (id, { rejectWithValue }) => {
  try {
    await productService.deleteProduct(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete product");
  }
});

// ✅ Slice
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
        toast.success("Product created successfully");
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) state.products[index] = action.payload;
        toast.success("Product updated successfully");
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload);
        toast.success("Product deleted successfully");
      });
  },
});

export default productSlice.reducer;
