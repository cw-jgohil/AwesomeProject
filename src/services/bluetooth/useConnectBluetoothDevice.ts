import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postCall } from '../../axios/instance';
import { BLUETOOTH_ROUTES } from './bluetoothAPIRoutes';
import { bluetoothQueryKeys, ApiResponse, BluetoothDevice } from './types';
import CONFIG from '../../config/config';

/**
 * Calls the connect bluetooth device API endpoint.
 * Isolated for reusability and testability.
 */
export const connectBluetoothDeviceMutationFn = async ({ deviceId }: { deviceId: string }): Promise<ApiResponse<BluetoothDevice>> => {
  try {
    if (!CONFIG.FEATURES.ENABLE_BLUETOOTH) {
      return { success: false, message: 'Bluetooth is disabled', error_code: 'BLUETOOTH_DISABLED' };
    }
    const response = await postCall<{ deviceId: string }>(BLUETOOTH_ROUTES.CONNECT, { deviceId });
    if (!response.data) {
      return { success: false, message: 'No response from server', error_code: 'NO_RESPONSE' };
    }
    return response.data as ApiResponse<BluetoothDevice>;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'An unexpected error occurred',
      error_code: error?.code || 'UNKNOWN_ERROR',
    };
  }
};

/**
 * Handles successful connect bluetooth device mutation.
 * Isolated for reusability and testability.
 */
export const handleConnectBluetoothDeviceSuccess = (queryClient: ReturnType<typeof useQueryClient>, deviceId: string) => {
  if (deviceId) {
    queryClient.setQueryData(
      bluetoothQueryKeys.device(deviceId),
      (old: BluetoothDevice | undefined) =>
        old ? { ...old, isConnected: true } : undefined
    );
  }
};

/**
 * Hook to connect to a bluetooth device, using isolated mutationFn and onSuccess logic.
 * @param options Additional React Query mutation options.
 */
export const useConnectBluetoothDevice = (options?: any) => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<BluetoothDevice>, unknown, { deviceId: string }>({
    mutationFn: connectBluetoothDeviceMutationFn,
    onSuccess: (_, variables) => handleConnectBluetoothDeviceSuccess(queryClient, variables.deviceId),
    ...options,
  });
}; 