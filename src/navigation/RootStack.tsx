import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '@screens/Login/LoginScreen';
import PublicScreen from '@screens/Public/PublicScreen';
import TabNavigator from './TabNavigator';
import { useAppStore } from '../store/useAppStore';

export type RootStackParamList = {
  Login: undefined;
  Public: undefined;
  MainTabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStack = () => {
  const isAuthenticated = useAppStore(state => state.isAuthenticated);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen name="Public" component={PublicScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Public" component={PublicScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootStack;
