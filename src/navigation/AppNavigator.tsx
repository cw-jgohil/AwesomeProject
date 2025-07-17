import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootStack from './RootStack';

const AppNavigator = () => (
  <NavigationContainer>
    <RootStack />
  </NavigationContainer>
);

export default AppNavigator;
