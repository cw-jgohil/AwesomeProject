import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postCall } from '../../axios/instance';
import { USER_ROUTES } from './userAPIRoutes';
import { userQueryKeys, ApiResponse, CreateUserRequest, User } from './types';

/**
 * Calls the create user API endpoint.
 * Isolated for reusability and testability.
 */
export const createUserMutationFn = async (userData: CreateUserRequest): Promise<ApiResponse<User>> => {
  try {
    const response = await postCall<CreateUserRequest>(USER_ROUTES.CREATE, userData);
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
 * Handles successful create user mutation.
 * Isolated for reusability and testability.
 */
export const handleCreateUserSuccess = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
};

/**
 * Hook to create a new user, using isolated mutationFn and onSuccess logic.
 * @param options Additional React Query mutation options.
 */
export const useCreateUser = (options?: any) => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<User>, unknown, CreateUserRequest>({
    mutationFn: createUserMutationFn,
    onSuccess: () => handleCreateUserSuccess(queryClient),
    ...options,
  });
}; 