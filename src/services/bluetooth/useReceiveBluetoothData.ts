import { useQuery } from '@tanstack/react-query';
import { getCall } from '../../axios/instance';
import { BLUETOOTH_ROUTES } from './bluetoothAPIRoutes';
import { bluetoothQueryKeys, ApiResponse, BluetoothData } from './types';
import CONFIG from '../../config/config';

/**
 * Fetches data received from a bluetooth device.
 * Isolated for reusability and testability.
 */
export const receiveBluetoothDataQueryFn = async (deviceId: string): Promise<ApiResponse<BluetoothData[]>> => {
  try {
    if (!CONFIG.FEATURES.ENABLE_BLUETOOTH) {
      return { success: false, message: 'Bluetooth is disabled', error_code: 'BLUETOOTH_DISABLED' };
    }
    const response = await getCall(`${BLUETOOTH_ROUTES.RECEIVE_DATA}/${deviceId}`);
    if (!response.data) {
      return { success: false, message: 'No response from server', error_code: 'NO_RESPONSE' };
    }
    return response.data as ApiResponse<BluetoothData[]>;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'An unexpected error occurred',
      error_code: error?.code || 'UNKNOWN_ERROR',
    };
  }
};

/**
 * Handles successful receive bluetooth data query.
 * Isolated for reusability and testability.
 * (Extend as needed for side effects)
 */
export const handleReceiveBluetoothDataSuccess = (data: ApiResponse<BluetoothData[]>) => {
  // Add any side effects here if needed
};

/**
 * React Query hook to fetch data from a bluetooth device.
 * @param deviceId The ID of the bluetooth device.
 * @param options Additional React Query options.
 */
export const useReceiveBluetoothData = (deviceId: string, options?: any) => {
  return useQuery<ApiResponse<BluetoothData[]>>({
    queryKey: [...bluetoothQueryKeys.data(), deviceId],
    queryFn: () => receiveBluetoothDataQueryFn(deviceId),
    enabled: !!deviceId && CONFIG.FEATURES.ENABLE_BLUETOOTH,
    refetchInterval: 1000, // Poll every second
    onSuccess: handleReceiveBluetoothDataSuccess,
    ...options,
  });
}; 