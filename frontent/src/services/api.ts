
import { toast } from "sonner";

const API_URL = "http://localhost:5000/api";

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  [key: string]: any;
}

/**
 * Base API service to communicate with the backend
 */
export const apiService = {
  /**
   * Set auth token for API requests
   */
  setAuthToken: (token: string | null) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  },

  /**
   * Get auth token from localStorage
   */
  getAuthToken: () => {
    return localStorage.getItem('token');
  },

  /**
   * Make a GET request to the API
   */
  get: async <T>(endpoint: string): Promise<T> => {
    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      return data as T;
    } catch (error: any) {
      toast.error(error.message || 'Network error');
      throw error;
    }
  },

  /**
   * Make a POST request to the API
   */
  post: async <T>(endpoint: string, body: any): Promise<T> => {
    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      return data as T;
    } catch (error: any) {
      toast.error(error.message || 'Network error');
      throw error;
    }
  },

  /**
   * Make a PUT request to the API
   */
  put: async <T>(endpoint: string, body: any): Promise<T> => {
    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(body)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      return data as T;
    } catch (error: any) {
      toast.error(error.message || 'Network error');
      throw error;
    }
  },

  /**
   * Make a DELETE request to the API
   */
  delete: async <T>(endpoint: string): Promise<T> => {
    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      return data as T;
    } catch (error: any) {
      toast.error(error.message || 'Network error');
      throw error;
    }
  }
};
