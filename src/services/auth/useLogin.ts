import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postCall } from '../../axios/instance';
import { AUTH_ROUTES } from './authAPIRoutes';
import { authQueryKeys, ApiResponse, LoginRequest, LoginData } from './types';
import storage from '../../utils/storage';
import CONFIG from '../../config/config';

/**
 * Calls the login API endpoint with the provided credentials.
 * Isolated for reusability and testability.
 */
export const loginMutationFn = async (credentials: LoginRequest): Promise<ApiResponse<LoginData>> => {
  try {
    const response = await postCall<LoginRequest>(AUTH_ROUTES.LOGIN, credentials);
    // Fallback: ensure response format
    if (!response.data) {
      return { success: false, message: 'No response from server', error_code: 'NO_RESPONSE' };
    }
    return response.data as ApiResponse<LoginData>;
  } catch (error: any) {
    // Fallback: handle network or unexpected errors
    return {
      success: false,
      message: error?.message || 'An unexpected error occurred',
      error_code: error?.code || 'UNKNOWN_ERROR',
    };
  }
};

/**
 * Handles successful login mutation.
 * Persists tokens and user data to storage for persistent login.
 */
export const handleLoginSuccess = async (
  data: ApiResponse<LoginData>,
  queryClient: ReturnType<typeof useQueryClient>
) => {
  if (data.success && data.data) {
    try {
      // Save tokens and user to storage for persistence
      await storage.setItem(CONFIG.STORAGE.ACCESS_TOKEN, data.data.access_token);
      await storage.setItem(CONFIG.STORAGE.REFRESH_TOKEN, data.data.refresh_token);
      await storage.setItem(CONFIG.STORAGE.USER_DATA, JSON.stringify(data.data.user));
      
      // Verify the data was actually saved
      const savedToken = await storage.getItem(CONFIG.STORAGE.ACCESS_TOKEN);
      const savedUser = await storage.getItem(CONFIG.STORAGE.USER_DATA);
      
      queryClient.invalidateQueries({ queryKey: authQueryKeys.user() });
      queryClient.setQueryData(authQueryKeys.profile(), data.data.user);
      
    } catch (storageError) {
      console.error('Storage error during login:', storageError);
    }
  }
};

/**
 * Hook to log in a user, using isolated mutationFn and onSuccess logic.
 * @param options Additional React Query mutation options.
 */
export const useLogin = (options?: any) => {
  const queryClient = useQueryClient();
  
  // Extract the custom onSuccess if provided
  const customOnSuccess = options?.onSuccess;
  
  return useMutation<ApiResponse<LoginData>, unknown, LoginRequest>({
    ...options,
    mutationFn: loginMutationFn,
    onSuccess: async (data, variables, context) => {
      try {
        // First handle our storage logic
        await handleLoginSuccess(data, queryClient);
      } catch (storageError) {
        console.error('Error in handleLoginSuccess:', storageError);
      }
      
      try {
        // Then call the custom onSuccess if provided
        if (customOnSuccess && typeof customOnSuccess === 'function') {
          await customOnSuccess(data, variables, context);
        }
      } catch (customError) {
        console.error('Error in custom onSuccess:', customError);
      }
    },
  });
}; 