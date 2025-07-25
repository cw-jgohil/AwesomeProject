/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import RNBootSplash from 'react-native-bootsplash';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  ActivityIndicator,
} from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './global.css';
import { ToastProvider } from './src/contexts/ToastContext';
import { NavigationContainer } from '@react-navigation/native';
import RootStack from './src/navigation/RootStack';
import storage from './src/utils/storage';
import CONFIG from './src/config/config';
import { useAppStore } from './src/store/useAppStore';

/**
 * Custom hook to hydrate auth state from storage on app start.
 * Sets Zustand store with user and isAuthenticated if token/user exist.
 */
function useHydrateAuth() {
  const { login, logout } = useAppStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    async function hydrate() {
      // Add a small delay to ensure storage is fully initialized
      await new Promise(resolve => setTimeout(resolve, 100));

      try {
        // Get auth data from storage
        const token = await storage.getItem(CONFIG.STORAGE.ACCESS_TOKEN);
        const userData = await storage.getItem(CONFIG.STORAGE.USER_DATA);

        if (token && userData) {
          try {
            const user = JSON.parse(userData);
            login(user);
          } catch (err) {
            logout();
          }
        } else {
          logout();
        }
      } catch (storageError) {
        console.error('Hydration storage error:', storageError);
        logout();
      }

      setHydrated(true);
    }
    hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return hydrated;
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  const hydrated = useHydrateAuth();
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    RNBootSplash.hide({ fade: true });
  }, []);

  if (!hydrated) {
    // Show a loading indicator while hydrating auth state
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <View className="flex-1 bg-white">
          <StatusBar
            networkActivityIndicatorVisible={true}
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          />
          <NavigationContainer>
            <RootStack />
          </NavigationContainer>
        </View>
      </ToastProvider>
    </QueryClientProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
