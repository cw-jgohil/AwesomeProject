import React from 'react';
import { View, Text } from 'react-native';

const PrivateScreen = () => (
  <View className="flex-1 items-center justify-center bg-white">
    <Text className="text-xl font-bold text-primary mb-2">
      Welcome to the Private Area!
    </Text>
    <Text className="text-base">This is only visible to logged-in users.</Text>
  </View>
);

export default PrivateScreen;
