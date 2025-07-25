// Types and query keys for the user module
// ----------------------------------------
// This file centralizes all types and query keys for user-related API hooks.

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

// React Query Keys for user data
export const userQueryKeys = {
  all: ['users'] as const,
  lists: () => [...userQueryKeys.all, 'list'] as const,
  list: (filters: string) => [...userQueryKeys.lists(), { filters }] as const,
  details: () => [...userQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...userQueryKeys.details(), id] as const,
}; 