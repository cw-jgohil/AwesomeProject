import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CONFIG } from '../../config/config';

// Types
export interface BluetoothDevice {
  id: string;
  name: string;
  address: string;
  rssi: number;
  isConnected: boolean;
}

export interface BluetoothData {
  deviceId: string;
  data: string;
  timestamp: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error_code?: string;
}

// React Query Keys
export const bluetoothQueryKeys = {
  all: ['bluetooth'] as const,
  devices: () => [...bluetoothQueryKeys.all, 'devices'] as const,
  device: (id: string) => [...bluetoothQueryKeys.devices(), id] as const,
  data: () => [...bluetoothQueryKeys.all, 'data'] as const,
};

// Hooks
export const useScanBluetoothDevices = () => {
  return useQuery({
    queryKey: bluetoothQueryKeys.devices(),
    queryFn: async (): Promise<ApiResponse<BluetoothDevice[]>> => {
      // This would be implemented with actual bluetooth scanning
      if (!CONFIG.FEATURES.ENABLE_BLUETOOTH) {
        throw new Error('Bluetooth is disabled');
      }
      
      // Placeholder implementation
      return {
        success: true,
        message: 'Devices scanned successfully',
        data: [],
      };
    },
    enabled: CONFIG.FEATURES.ENABLE_BLUETOOTH,
    staleTime: 30 * 1000, // 30 seconds
    retry: 1,
  });
};

export const useConnectBluetoothDevice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (deviceId: string): Promise<ApiResponse> => {
      // This would be implemented with actual bluetooth connection
      if (!CONFIG.FEATURES.ENABLE_BLUETOOTH) {
        throw new Error('Bluetooth is disabled');
      }
      
      // Placeholder implementation
      return {
        success: true,
        message: 'Device connected successfully',
      };
    },
    onSuccess: (_, deviceId) => {
      // Update device status in cache
      queryClient.setQueryData(
        bluetoothQueryKeys.device(deviceId),
        (old: BluetoothDevice | undefined) => 
          old ? { ...old, isConnected: true } : undefined
      );
    },
    onError: (error) => {
      console.error('Bluetooth connection failed:', error);
    },
  });
};

export const useDisconnectBluetoothDevice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (deviceId: string): Promise<ApiResponse> => {
      // This would be implemented with actual bluetooth disconnection
      if (!CONFIG.FEATURES.ENABLE_BLUETOOTH) {
        throw new Error('Bluetooth is disabled');
      }
      
      // Placeholder implementation
      return {
        success: true,
        message: 'Device disconnected successfully',
      };
    },
    onSuccess: (_, deviceId) => {
      // Update device status in cache
      queryClient.setQueryData(
        bluetoothQueryKeys.device(deviceId),
        (old: BluetoothDevice | undefined) => 
          old ? { ...old, isConnected: false } : undefined
      );
    },
    onError: (error) => {
      console.error('Bluetooth disconnection failed:', error);
    },
  });
};

export const useSendBluetoothData = () => {
  return useMutation({
    mutationFn: async ({ deviceId, data }: { deviceId: string; data: string }): Promise<ApiResponse> => {
      // This would be implemented with actual bluetooth data sending
      if (!CONFIG.FEATURES.ENABLE_BLUETOOTH) {
        throw new Error('Bluetooth is disabled');
      }
      
      // Placeholder implementation
      return {
        success: true,
        message: 'Data sent successfully',
      };
    },
    onError: (error) => {
      console.error('Send bluetooth data failed:', error);
    },
  });
};

export const useReceiveBluetoothData = (deviceId: string) => {
  return useQuery({
    queryKey: [...bluetoothQueryKeys.data(), deviceId],
    queryFn: async (): Promise<ApiResponse<BluetoothData[]>> => {
      // This would be implemented with actual bluetooth data receiving
      if (!CONFIG.FEATURES.ENABLE_BLUETOOTH) {
        throw new Error('Bluetooth is disabled');
      }
      
      // Placeholder implementation
      return {
        success: true,
        message: 'Data received successfully',
        data: [],
      };
    },
    enabled: !!deviceId && CONFIG.FEATURES.ENABLE_BLUETOOTH,
    refetchInterval: 1000, // Poll every second
    retry: 1,
  });
}; 