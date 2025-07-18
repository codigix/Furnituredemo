import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../services/authService';
import { toast } from 'sonner';

// ✅ Restore token & user from localStorage on refresh
const token = localStorage.getItem('token');
const storedUser = localStorage.getItem('user');

const initialState = {
  token: token || null,
  user: storedUser ? JSON.parse(storedUser) : null,
  isAuthenticated: !!token,
  isLoading: false,
  error: null,
};

// ==================== ASYNC THUNKS ====================
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authService.login(email, password);

      // ✅ Save token & user in localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (tokenId, { rejectWithValue }) => {
    try {
      const response = await authService.googleAuth(tokenId);

      // ✅ Save token & user in localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Google login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      await authService.register(name, email, password);
      return { success: true };
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const getUserProfile = createAsyncThunk(
  'auth/getUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getUserProfile();

      // ✅ Update localStorage when user profile changes
      localStorage.setItem('user', JSON.stringify(response.user));

      return response.user;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to get user profile');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.updateUserProfile(userData);

      // ✅ Update localStorage when user profile updates
      localStorage.setItem('user', JSON.stringify(response.user));

      return response.user;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update user profile');
    }
  }
);

// ==================== SLICE ====================
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      authService.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      toast.success('Logged out successfully');
    },
    clearError: (state) => {
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      // ✅ Also persist when using manual loginSuccess
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    registerSuccess: (state) => {
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    // ========== LOGIN ==========
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      toast.success('Login successful');
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      toast.error(action.payload || 'Login failed');
    });

    // ========== GOOGLE LOGIN ==========
    builder.addCase(googleLogin.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(googleLogin.fulfilled, (state, action) => {
      state.isLoading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      toast.success('Google login successful');
    });
    builder.addCase(googleLogin.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      toast.error(action.payload || 'Google login failed');
    });

    // ========== REGISTER ==========
    builder.addCase(register.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state) => {
      state.isLoading = false;
      toast.success('Registration successful. You can now log in.');
    });
    builder.addCase(register.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      toast.error(action.payload || 'Registration failed');
    });

    // ========== GET USER PROFILE ==========
    builder.addCase(getUserProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getUserProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
    });
    builder.addCase(getUserProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    });

    // ========== UPDATE USER PROFILE ==========
    builder.addCase(updateUserProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      toast.success('Profile updated successfully');
    });
    builder.addCase(updateUserProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      toast.error(action.payload || 'Failed to update profile');
    });
  },
});

export const { logout, clearError, loginSuccess, registerSuccess } = authSlice.actions;
export default authSlice.reducer;
