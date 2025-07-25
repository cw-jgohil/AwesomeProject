import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postCall } from '../../axios/instance';
import { AUTH_ROUTES } from './authAPIRoutes';
import { authQueryKeys, ApiResponse } from './types';
import storage from '../../utils/storage';
import CONFIG from '../../config/config';

/**
 * Calls the logout API endpoint.
 * Isolated for reusability and testability.
 */
export const logoutMutationFn = async (): Promise<ApiResponse> => {
  try {
    const response = await postCall(AUTH_ROUTES.LOGOUT, {});
    if (!response.data) {
      return { success: false, message: 'No response from server', error_code: 'NO_RESPONSE' };
    }
    return response.data as ApiResponse;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'An unexpected error occurred',
      error_code: error?.code || 'UNKNOWN_ERROR',
    };
  }
};

/**
 * Handles successful logout mutation.
 * Removes all auth-related data from storage.
 */
export const handleLogoutSuccess = async (queryClient: ReturnType<typeof useQueryClient>) => {
  await storage.removeItem(CONFIG.STORAGE.ACCESS_TOKEN);
  await storage.removeItem(CONFIG.STORAGE.REFRESH_TOKEN);
  await storage.removeItem(CONFIG.STORAGE.USER_DATA);
  queryClient.removeQueries({ queryKey: authQueryKeys.all });
  queryClient.clear();
};

/**
 * Hook to log out the current user, using isolated mutationFn and onSuccess logic.
 * @param options Additional React Query mutation options.
 */
export const useLogout = (options?: any) => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse, unknown, void>({
    mutationFn: logoutMutationFn,
    onSuccess: () => handleLogoutSuccess(queryClient),
    ...options,
  });
}; 