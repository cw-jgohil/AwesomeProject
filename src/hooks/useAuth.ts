import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/AuthService';
import { apiService, LoginRequest } from '../services/ApiService';

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
};

// Hook for login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const result = await authService.login(credentials.username, credentials.password);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
  });
};

// Hook for logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      await authService.logout();
    },
    onSuccess: () => {
      // Clear all auth-related queries
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });
};

// Hook for guest login
export const useGuestLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      return await authService.guest();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
    },
  });
};

// Hook for getting current user
export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: () => authService.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for getting user profile from API
export const useUserProfile = () => {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: async () => {
      const response = await apiService.getUserProfile();
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    },
    enabled: authService.isAuthenticated() && !authService.isGuest(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for refreshing user data
export const useRefreshUserData = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      await authService.refreshUserData();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
  });
};

// Hook for checking authentication status
export const useAuthStatus = () => {
  return useQuery({
    queryKey: [...authKeys.all, 'status'],
    queryFn: () => ({
      isAuthenticated: authService.isAuthenticated(),
      isGuest: authService.isGuest(),
      user: authService.getCurrentUser(),
    }),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}; 