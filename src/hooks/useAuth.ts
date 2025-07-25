import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { loginMutationFn } from '../services/auth/useLogin';
import { logoutMutationFn } from '../services/auth/useLogout';
import { getUserProfileQueryFn } from '../services/auth/useGetUserProfile';
import { LoginRequest } from '../services/auth/types';
import api from '../axios/instance';

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
      return await loginMutationFn(credentials);
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
      return await logoutMutationFn();
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
      // Implement guest login if available, else throw
      throw new Error('Guest login not implemented');
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
    queryFn: () => {
      // TODO: Implement getCurrentUser logic or use zustand store
      return null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for getting user profile from API
export const useUserProfile = () => {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: async () => {
      return await getUserProfileQueryFn();
    },
    enabled: false, // Disabled as per original code, as authService.isAuthenticated() and authService.isGuest() are not available here
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for refreshing user data
export const useRefreshUserData = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      // Implement refreshUserData if available
      throw new Error('refreshUserData not implemented');
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
      // Implement or use zustand store for auth status
      isAuthenticated: false,
      isGuest: false,
      user: null,
    }),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}; 