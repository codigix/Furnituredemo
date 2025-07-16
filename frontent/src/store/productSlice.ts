
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { productService, Product } from '../services/productService';
import { toast } from 'sonner';

interface ProductState {
  products: Product[];
  featuredProducts: Product[]; // Adding featuredProducts property
  currentProduct: Product | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  featuredProducts: [], // Initialize featuredProducts
  currentProduct: null,
  isLoading: false,
  error: null,
};

// Async thunks for products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getProducts();
      return response.products;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await productService.getProductById(id);
      return response.product;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch product');
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData: {
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    stock: number;
  }, { rejectWithValue }) => {
    try {
      const response = await productService.createProduct(productData);
      return response.product;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }: {
    id: string;
    productData: Partial<{
      name: string;
      description: string;
      price: number;
      image: string;
      category: string;
      stock: number;
    }>
  }, { rejectWithValue }) => {
    try {
      const response = await productService.updateProduct(id, productData);
      return response.product;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: string, { rejectWithValue }) => {
    try {
      await productService.deleteProduct(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete product');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch Products
    builder.addCase(fetchProducts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
      state.isLoading = false;
      state.products = action.payload;
      // Set featured products - for example, first 4 products
      state.featuredProducts = action.payload.slice(0, 4);
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string || 'Failed to fetch products');
    });

    // Fetch Product By ID
    builder.addCase(fetchProductById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
      state.isLoading = false;
      state.currentProduct = action.payload;
    });
    builder.addCase(fetchProductById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string || 'Failed to fetch product');
    });

    // Create Product
    builder.addCase(createProduct.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
      state.isLoading = false;
      state.products.push(action.payload);
      toast.success('Product created successfully');
    });
    builder.addCase(createProduct.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string || 'Failed to create product');
    });

    // Update Product
    builder.addCase(updateProduct.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
      state.isLoading = false;
      const index = state.products.findIndex(product => product._id === action.payload._id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
      state.currentProduct = action.payload;
      toast.success('Product updated successfully');
    });
    builder.addCase(updateProduct.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string || 'Failed to update product');
    });

    // Delete Product
    builder.addCase(deleteProduct.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.products = state.products.filter(product => product._id !== action.payload);
      toast.success('Product deleted successfully');
    });
    builder.addCase(deleteProduct.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string || 'Failed to delete product');
    });
  },
});

// Re-export Product type to fix missing import errors
export type { Product } from '../services/productService';

export const { clearProductError, clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
