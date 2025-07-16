
import { apiService } from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}

export const authService = {
  /**
   * Login user
   */
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiService.post<LoginResponse>('/users/login', { 
      email, 
      password 
    });
    
    if (response.success && response.token) {
      apiService.setAuthToken(response.token);
    }
    
    return response;
  },

  /**
   * Google authentication
   */
  googleAuth: async (tokenId: string): Promise<LoginResponse> => {
    const response = await apiService.post<LoginResponse>('/users/google-auth', {
      tokenId
    });

    if (response.success && response.token) {
      apiService.setAuthToken(response.token);
    }

    return response;
  },

  /**
   * Register user
   */
  register: async (name: string, email: string, password: string): Promise<RegisterResponse> => {
    const response = await apiService.post<RegisterResponse>('/users/register', {
      name,
      email,
      password
    });
    
    return response;
  },

  /**
   * Get current user profile
   */
  getUserProfile: async (): Promise<{ success: boolean; user: User }> => {
    return apiService.get<{ success: boolean; user: User }>('/users/profile');
  },

  /**
   * Update user profile
   */
  updateUserProfile: async (userData: { 
    name?: string; 
    email?: string; 
    password?: string 
  }): Promise<{ success: boolean; user: User }> => {
    return apiService.put<{ success: boolean; user: User }>('/users/profile', userData);
  },

  /**
   * Logout user
   */
  logout: (): void => {
    apiService.setAuthToken(null);
  }
};
