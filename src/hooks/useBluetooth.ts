import { useState } from 'react';

export function useBluetooth() {
  const [isConnected, setIsConnected] = useState(false);
  // Add Bluetooth logic here
  return { isConnected };
} 