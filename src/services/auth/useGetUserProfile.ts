import { useQuery } from '@tanstack/react-query';
import { getCall } from '../../axios/instance';
import { AUTH_ROUTES } from './authAPIRoutes';
import { authQueryKeys, ApiResponse, LoginData } from './types';

/**
 * Fetches the current user's profile from the API.
 * Isolated for reusability and testability.
 */
export const getUserProfileQueryFn = async () => {
  try {
    const response = await getCall(AUTH_ROUTES.ME);
    if (!response.data) {
      return { success: false, message: 'No response from server', error_code: 'NO_RESPONSE' };
    }
    return response.data as ApiResponse<LoginData['user']>;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'An unexpected error occurred',
      error_code: error?.code || 'UNKNOWN_ERROR',
    };
  }
};

/**
 * Handles successful user profile query.
 * Isolated for reusability and testability.
 * (Extend as needed for side effects)
 */
export const handleGetUserProfileSuccess = (data: ApiResponse<LoginData['user']>) => {
  // Add any side effects here if needed
};

/**
 * React Query hook to fetch the current user's profile.
 * @param options Additional React Query options.
 */
export const useGetUserProfile = (options?: any) => {
  return useQuery<ApiResponse<LoginData['user']>>({
    queryKey: authQueryKeys.profile(),
    queryFn: getUserProfileQueryFn,
    onSuccess: handleGetUserProfileSuccess,
    ...options,
  });
}; 