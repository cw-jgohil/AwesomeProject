import { useMutation } from '@tanstack/react-query';
import { postCall } from '../../axios/instance';
import { AUTH_ROUTES } from './authAPIRoutes';
import { ApiResponse, LoginData } from './types';

/**
 * Calls the refresh token API endpoint.
 * Isolated for reusability and testability.
 */
export const refreshTokenMutationFn = async (refreshToken: string): Promise<ApiResponse<LoginData>> => {
  try {
    const response = await postCall<{ refresh_token: string }>(AUTH_ROUTES.REFRESH, { refresh_token: refreshToken });
    if (!response.data) {
      return { success: false, message: 'No response from server', error_code: 'NO_RESPONSE' };
    }
    return response.data as ApiResponse<LoginData>;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'An unexpected error occurred',
      error_code: error?.code || 'UNKNOWN_ERROR',
    };
  }
};

/**
 * Handles successful refresh token mutation.
 * Isolated for reusability and testability.
 * (Extend as needed for side effects)
 */
export const handleRefreshTokenSuccess = (data: ApiResponse<LoginData>) => {
  // Add any side effects here if needed
};

/**
 * Hook to refresh the access token, using isolated mutationFn and onSuccess logic.
 * @param options Additional React Query mutation options.
 */
export const useRefreshToken = (options?: any) => {
  return useMutation<ApiResponse<LoginData>, unknown, string>({
    mutationFn: refreshTokenMutationFn,
    onSuccess: handleRefreshTokenSuccess,
    ...options,
  });
}; 