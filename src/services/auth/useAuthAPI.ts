import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiService from '../ApiService';
import { AUTH_ROUTES } from './authAPIRoutes';
import { CONFIG } from '../../config/config';

// Types
export interface LoginRequest {
  username: string;
  password: string;
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

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error_code?: string;
}

// React Query Keys
export const authQueryKeys = {
  all: ['auth'] as const,
  user: () => [...authQueryKeys.all, 'user'] as const,
  profile: () => [...authQueryKeys.user(), 'profile'] as const,
};

// Hooks
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (credentials: LoginRequest) => apiService.login(credentials),
    onSuccess: (data: ApiResponse<LoginData>) => {
      if (data.success && data.data) {
        // Invalidate and refetch user data
        queryClient.invalidateQueries({ queryKey: authQueryKeys.user() });
        queryClient.setQueryData(authQueryKeys.profile(), data.data.user);
      }
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => apiService.logout(),
    onSuccess: () => {
      // Clear all auth-related queries
      queryClient.removeQueries({ queryKey: authQueryKeys.all });
      queryClient.clear();
    },
    onError: (error) => {
      console.error('Logout failed:', error);
    },
  });
};

export const useGetUserProfile = () => {
  return useQuery({
    queryKey: authQueryKeys.profile(),
    queryFn: () => apiService.getUserProfile(),
    enabled: false, // Only fetch when explicitly called
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: (refreshToken: string) => apiService.refreshToken(refreshToken),
    onError: (error) => {
      console.error('Token refresh failed:', error);
    },
  });
};

export const useIsAuthenticated = () => {
  return useQuery({
    queryKey: [...authQueryKeys.all, 'isAuthenticated'],
    queryFn: () => apiService.isAuthenticated(),
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: false,
  });
}; 