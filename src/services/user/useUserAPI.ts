import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiService from '../ApiService';
import { USER_ROUTES } from './userAPIRoutes';

// Types
export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  role_id?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  role_id?: number;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  full_name?: string;
  role_id?: number;
  is_active?: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error_code?: string;
}

// React Query Keys
export const userQueryKeys = {
  all: ['users'] as const,
  lists: () => [...userQueryKeys.all, 'list'] as const,
  list: (filters: string) => [...userQueryKeys.lists(), { filters }] as const,
  details: () => [...userQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...userQueryKeys.details(), id] as const,
};

// Hooks
export const useGetUserList = (filters?: string) => {
  return useQuery({
    queryKey: userQueryKeys.list(filters || ''),
    queryFn: async () => {
      // This would be implemented in ApiService
      const response = await apiService.getUserProfile(); // Placeholder
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

export const useGetUser = (id: number) => {
  return useQuery({
    queryKey: userQueryKeys.detail(id),
    queryFn: async () => {
      // This would be implemented in ApiService
      const response = await apiService.getUserProfile(); // Placeholder
      return response;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: CreateUserRequest) => {
      // This would be implemented in ApiService
      return Promise.resolve({ success: true, message: 'User created' } as ApiResponse);
    },
    onSuccess: () => {
      // Invalidate user lists
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
    },
    onError: (error) => {
      console.error('Create user failed:', error);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, userData }: { id: number; userData: UpdateUserRequest }) => {
      // This would be implemented in ApiService
      return Promise.resolve({ success: true, message: 'User updated' } as ApiResponse);
    },
    onSuccess: (_, { id }) => {
      // Invalidate specific user and user lists
      queryClient.invalidateQueries({ queryKey: userQueryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
    },
    onError: (error) => {
      console.error('Update user failed:', error);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => {
      // This would be implemented in ApiService
      return Promise.resolve({ success: true, message: 'User deleted' } as ApiResponse);
    },
    onSuccess: (_, id) => {
      // Remove from cache and invalidate lists
      queryClient.removeQueries({ queryKey: userQueryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
    },
    onError: (error) => {
      console.error('Delete user failed:', error);
    },
  });
}; 