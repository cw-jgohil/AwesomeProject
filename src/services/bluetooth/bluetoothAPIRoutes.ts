export const BLUETOOTH_ROUTES = {
  SCAN: '/bluetooth/scan',
  CONNECT: '/bluetooth/connect',
  DISCONNECT: '/bluetooth/disconnect',
  SEND_DATA: '/bluetooth/send',
  RECEIVE_DATA: '/bluetooth/receive',
} as const;

export type BluetoothRoute = typeof BLUETOOTH_ROUTES[keyof typeof BLUETOOTH_ROUTES]; 