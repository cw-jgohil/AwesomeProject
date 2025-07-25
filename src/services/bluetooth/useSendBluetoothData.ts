import { useMutation } from '@tanstack/react-query';
import { postCall } from '../../axios/instance';
import { BLUETOOTH_ROUTES } from './bluetoothAPIRoutes';
import { ApiResponse } from './types';
import CONFIG from '../../config/config';

/**
 * Calls the send bluetooth data API endpoint.
 * Isolated for reusability and testability.
 */
export const sendBluetoothDataMutationFn = async ({ deviceId, data }: { deviceId: string; data: string }): Promise<ApiResponse> => {
  try {
    if (!CONFIG.FEATURES.ENABLE_BLUETOOTH) {
      return { success: false, message: 'Bluetooth is disabled', error_code: 'BLUETOOTH_DISABLED' };
    }
    const response = await postCall<{ deviceId: string; data: string }>(BLUETOOTH_ROUTES.SEND_DATA, { deviceId, data });
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
 * Handles successful send bluetooth data mutation.
 * Isolated for reusability and testability.
 * (Extend as needed for side effects)
 */
export const handleSendBluetoothDataSuccess = (data: ApiResponse) => {
  // Add any side effects here if needed
};

/**
 * Hook to send data to a bluetooth device, using isolated mutationFn and onSuccess logic.
 * @param options Additional React Query mutation options.
 */
export const useSendBluetoothData = (options?: any) => {
  return useMutation<ApiResponse, unknown, { deviceId: string; data: string }>({
    mutationFn: sendBluetoothDataMutationFn,
    onSuccess: handleSendBluetoothDataSuccess,
    ...options,
  });
}; 