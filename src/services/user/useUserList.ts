import { useQuery } from '@tanstack/react-query';
import { getCall } from '../../axios/instance';
import { USER_ROUTES } from './userAPIRoutes';
import { userQueryKeys, ApiResponse, User } from './types';

/**
 * Fetches the list of users from the API.
 * Isolated for reusability and testability.
 */
export const getUserListQueryFn = async (filters?: string) => {
  try {
    const response = await getCall(USER_ROUTES.LIST + (filters ? `?${filters}` : ''));
    if (!response.data) {
      return { success: false, message: 'No response from server', error_code: 'NO_RESPONSE' };
    }
    return response.data as ApiResponse<User[]>;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'An unexpected error occurred',
      error_code: error?.code || 'UNKNOWN_ERROR',
    };
  }
};

/**
 * Handles successful user list query.
 * Isolated for reusability and testability.
 * (Extend as needed for side effects)
 */
export const handleGetUserListSuccess = (data: ApiResponse<User[]>) => {
  // Add any side effects here if needed
};

/**
 * Fetches the list of users from the API.
 * @param filters Optional filter string for the user list endpoint.
 * @param options Additional React Query options.
 */
export const useUserList = (filters?: string, options?: any) => {
  return useQuery<ApiResponse<User[]>>({
    queryKey: userQueryKeys.list(filters || ''),
    queryFn: () => getUserListQueryFn(filters),
    onSuccess: handleGetUserListSuccess,
    ...options,
  });
}; 