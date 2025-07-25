import { useQuery } from '@tanstack/react-query';
import { getCall } from '../../axios/instance';
import { USER_ROUTES } from './userAPIRoutes';
import { userQueryKeys, ApiResponse, User } from './types';

/**
 * Fetches details for a single user by ID.
 * Isolated for reusability and testability.
 */
export const getUserDetailsQueryFn = async (id: number) => {
  try {
    const response = await getCall(`${USER_ROUTES.PROFILE}/${id}`);
    if (!response.data) {
      return { success: false, message: 'No response from server', error_code: 'NO_RESPONSE' };
    }
    return response.data as ApiResponse<User>;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'An unexpected error occurred',
      error_code: error?.code || 'UNKNOWN_ERROR',
    };
  }
};

/**
 * Handles successful user details query.
 * Isolated for reusability and testability.
 * (Extend as needed for side effects)
 */
export const handleGetUserDetailsSuccess = (data: ApiResponse<User>) => {
  // Add any side effects here if needed
};

/**
 * Fetches details for a single user by ID.
 * @param id User ID
 * @param options Additional React Query options.
 */
export const useUserDetails = (id: number, options?: any) => {
  return useQuery<ApiResponse<User>>({
    queryKey: userQueryKeys.detail(id),
    queryFn: () => getUserDetailsQueryFn(id),
    enabled: !!id,
    onSuccess: handleGetUserDetailsSuccess,
    ...options,
  });
}; 