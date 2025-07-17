import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '@screens/Login/LoginScreen';
import PublicScreen from '@screens/Public/PublicScreen';
import PrivateScreen from '@screens/Private/PrivateScreen';

export type RootStackParamList = {
  Login: undefined;
  Public: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStack = () => {
  return (
    <Stack.Navigator id={undefined}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Public"
        component={PublicScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Home"
        component={PrivateScreen}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
};

export default RootStack;
