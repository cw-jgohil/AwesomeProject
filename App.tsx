/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import RNBootSplash from 'react-native-bootsplash';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './global.css';
import AppNavigator from './src/navigation/AppNavigator';
import { ToastProvider } from './src/contexts/ToastContext';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    RNBootSplash.hide({ fade: true });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <View className="flex-1 bg-white">
          <StatusBar
            networkActivityIndicatorVisible={true}
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          />
          <AppNavigator />
        </View>
      </ToastProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
