// Types and query keys for the bluetooth module
// ---------------------------------------------
// This file centralizes all types and query keys for bluetooth-related API hooks.

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

// React Query Keys for bluetooth data
export const bluetoothQueryKeys = {
  all: ['bluetooth'] as const,
  devices: () => [...bluetoothQueryKeys.all, 'devices'] as const,
  device: (id: string) => [...bluetoothQueryKeys.devices(), id] as const,
  data: () => [...bluetoothQueryKeys.all, 'data'] as const,
}; 