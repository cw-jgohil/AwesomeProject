import { useMutation, useQueryClient } from '@tanstack/react-query';
import { putCall } from '../../axios/instance';
import { USER_ROUTES } from './userAPIRoutes';
import { userQueryKeys, ApiResponse, UpdateUserRequest, User } from './types';

/**
 * Calls the update user API endpoint.
 * Isolated for reusability and testability.
 */
export const updateUserMutationFn = async ({ id, userData }: { id: number; userData: UpdateUserRequest }): Promise<ApiResponse<User>> => {
  try {
    const response = await putCall<UpdateUserRequest>(`${USER_ROUTES.UPDATE}/${id}`, userData);
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
 * Handles successful update user mutation.
 * Isolated for reusability and testability.
 */
export const handleUpdateUserSuccess = (queryClient: ReturnType<typeof useQueryClient>, id: number) => {
  if (id) {
    queryClient.invalidateQueries({ queryKey: userQueryKeys.detail(id) });
  }
  queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
};

/**
 * Hook to update an existing user, using isolated mutationFn and onSuccess logic.
 * @param options Additional React Query mutation options.
 */
export const useUpdateUser = (options?: any) => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<User>, unknown, { id: number; userData: UpdateUserRequest }>({
    mutationFn: updateUserMutationFn,
    onSuccess: (_, variables) => handleUpdateUserSuccess(queryClient, variables.id),
    ...options,
  });
}; 