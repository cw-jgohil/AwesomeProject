import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCall } from '../../axios/instance';
import { USER_ROUTES } from './userAPIRoutes';
import { userQueryKeys, ApiResponse } from './types';

/**
 * Calls the delete user API endpoint.
 * Isolated for reusability and testability.
 */
export const deleteUserMutationFn = async (id: number): Promise<ApiResponse> => {
  try {
    const response = await deleteCall(`${USER_ROUTES.DELETE}/${id}`);
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
 * Handles successful delete user mutation.
 * Isolated for reusability and testability.
 */
export const handleDeleteUserSuccess = (queryClient: ReturnType<typeof useQueryClient>, id: number) => {
  if (id) {
    queryClient.removeQueries({ queryKey: userQueryKeys.detail(id) });
  }
  queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
};

/**
 * Hook to delete a user by ID, using isolated mutationFn and onSuccess logic.
 * @param options Additional React Query mutation options.
 */
export const useDeleteUser = (options?: any) => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse, unknown, number>({
    mutationFn: deleteUserMutationFn,
    onSuccess: (_, id) => handleDeleteUserSuccess(queryClient, id),
    ...options,
  });
}; 