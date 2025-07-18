import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import storage from '../utils/storage';
import { CONFIG } from '../config/config';

// Extend AxiosRequestConfig to include _retry property
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error_code?: string;
}

export interface LoginData {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: number;
    username: string;
    email: string;
    full_name?: string;
    role_id?: number;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
  };
}

export interface LoginRequest {
  username: string;
  password: string;
}

class ApiService {
  private api: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
  }> = [];

  constructor() {
    this.api = axios.create({
      baseURL: CONFIG.API.BASE_URL,
      timeout: CONFIG.API.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                return this.api(originalRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = await this.getRefreshToken();
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            const response = await this.refreshToken(refreshToken);
            const newAccessToken = response.data?.access_token;
            
            if (newAccessToken) {
              await this.setAccessToken(newAccessToken);
              if (response.data?.refresh_token) {
                await this.setRefreshToken(response.data.refresh_token);
              }
              
              // Retry failed requests
              this.failedQueue.forEach(({ resolve }) => {
                resolve(newAccessToken);
              });
              this.failedQueue = [];

              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              }
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, clear tokens and redirect to login
            await this.clearTokens();
            this.failedQueue.forEach(({ reject }) => {
              reject(refreshError);
            });
            this.failedQueue = [];
            throw refreshError;
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Token Management
  private async getAccessToken(): Promise<string | null> {
    try {
      return await storage.getItem(CONFIG.STORAGE.ACCESS_TOKEN);
    } catch {
      return null;
    }
  }

  private async setAccessToken(token: string): Promise<void> {
    try {
      await storage.setItem(CONFIG.STORAGE.ACCESS_TOKEN, token);
    } catch (error) {
      console.error('Failed to store access token:', error);
    }
  }

  private async getRefreshToken(): Promise<string | null> {
    try {
      return await storage.getItem(CONFIG.STORAGE.REFRESH_TOKEN);
    } catch {
      return null;
    }
  }

  private async setRefreshToken(token: string): Promise<void> {
    try {
      await storage.setItem(CONFIG.STORAGE.REFRESH_TOKEN, token);
    } catch (error) {
      console.error('Failed to store refresh token:', error);
    }
  }

  public async clearTokens(): Promise<void> {
    try {
      await storage.removeItem(CONFIG.STORAGE.ACCESS_TOKEN);
      await storage.removeItem(CONFIG.STORAGE.REFRESH_TOKEN);
      await storage.removeItem(CONFIG.STORAGE.USER_DATA);
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }

  // API Methods
  public async login(credentials: LoginRequest): Promise<ApiResponse<LoginData>> {
    try {
      const response = await this.api.post<ApiResponse<LoginData>>(CONFIG.API.ENDPOINTS.AUTH.LOGIN, credentials);
      
      if (response.data.success && response.data.data) {
        await this.setAccessToken(response.data.data.access_token);
        await this.setRefreshToken(response.data.data.refresh_token);
        await storage.setItem(CONFIG.STORAGE.USER_DATA, JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async refreshToken(refreshToken: string): Promise<ApiResponse<LoginData>> {
    try {
      const response = await this.api.post<ApiResponse<LoginData>>(CONFIG.API.ENDPOINTS.AUTH.REFRESH, {
        refresh_token: refreshToken,
      });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async logout(): Promise<void> {
    await this.clearTokens();
  }

  public async getUserProfile(): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.get<ApiResponse<any>>(CONFIG.API.ENDPOINTS.AUTH.ME);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Error Handling
  private handleError(error: any): ApiResponse {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiResponse>;
      
      if (axiosError.response?.data) {
        return {
          success: false,
          message: axiosError.response.data.message || 'An error occurred',
          error_code: axiosError.response.data.error_code,
        };
      }
      
      if (axiosError.code === 'NETWORK_ERROR') {
        return {
          success: false,
          message: 'Network error. Please check your connection.',
          error_code: 'NETWORK_ERROR',
        };
      }
      
      if (axiosError.code === 'TIMEOUT') {
        return {
          success: false,
          message: 'Request timeout. Please try again.',
          error_code: 'TIMEOUT',
        };
      }
    }
    
    return {
      success: false,
      message: 'An unexpected error occurred',
      error_code: 'UNKNOWN_ERROR',
    };
  }

  // Utility Methods
  public async isAuthenticated(): Promise<boolean> {
    const token = await this.getAccessToken();
    return !!token;
  }

  public async getUserData(): Promise<any | null> {
    try {
      const userData = await storage.getItem(CONFIG.STORAGE.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }
}

export const apiService = new ApiService();
export default apiService; 