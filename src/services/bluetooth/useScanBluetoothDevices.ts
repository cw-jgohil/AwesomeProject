import { useQuery } from '@tanstack/react-query';
import { getCall } from '../../axios/instance';
import { BLUETOOTH_ROUTES } from './bluetoothAPIRoutes';
import { bluetoothQueryKeys, ApiResponse, BluetoothDevice } from './types';
import CONFIG from '../../config/config';

/**
 * Fetches the list of available bluetooth devices from the API.
 * Isolated for reusability and testability.
 */
export const scanBluetoothDevicesQueryFn = async (): Promise<ApiResponse<BluetoothDevice[]>> => {
  try {
    if (!CONFIG.FEATURES.ENABLE_BLUETOOTH) {
      return { success: false, message: 'Bluetooth is disabled', error_code: 'BLUETOOTH_DISABLED' };
    }
    const response = await getCall(BLUETOOTH_ROUTES.SCAN);
    if (!response.data) {
      return { success: false, message: 'No response from server', error_code: 'NO_RESPONSE' };
    }
    return response.data as ApiResponse<BluetoothDevice[]>;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'An unexpected error occurred',
      error_code: error?.code || 'UNKNOWN_ERROR',
    };
  }
};

/**
 * Handles successful scan bluetooth devices query.
 * Isolated for reusability and testability.
 * (Extend as needed for side effects)
 */
export const handleScanBluetoothDevicesSuccess = (data: ApiResponse<BluetoothDevice[]>) => {
  // Add any side effects here if needed
};

/**
 * React Query hook to fetch the list of bluetooth devices.
 * @param options Additional React Query options.
 */
export const useScanBluetoothDevices = (options?: any) => {
  return useQuery<ApiResponse<BluetoothDevice[]>>({
    queryKey: bluetoothQueryKeys.devices(),
    queryFn: scanBluetoothDevicesQueryFn,
    enabled: CONFIG.FEATURES.ENABLE_BLUETOOTH,
    onSuccess: handleScanBluetoothDevicesSuccess,
    ...options,
  });
}; 