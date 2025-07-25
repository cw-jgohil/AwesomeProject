// Types and query keys for the auth module
// ----------------------------------------
// This file centralizes all types and query keys for auth-related API hooks.

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

// React Query Keys for auth data
export const authQueryKeys = {
  all: ['auth'] as const,
  user: () => [...authQueryKeys.all, 'user'] as const,
  profile: () => [...authQueryKeys.user(), 'profile'] as const,
}; 