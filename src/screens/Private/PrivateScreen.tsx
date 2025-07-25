import React from 'react';
import { View, Text } from 'react-native';
import { useAppStore } from '../../store/useAppStore';

const PrivateScreen = () => {
  const user = useAppStore(state => state.user);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-primary mb-2">
        Welcome to the Private Area!
      </Text>
      <Text className="text-base mb-4">
        This is only visible to logged-in users.
      </Text>
      {user ? (
        <View className="p-4 border rounded-lg bg-gray-50">
          <Text className="text-lg font-semibold mb-2">User Details:</Text>
          <Text className="text-base">Username: {user.username}</Text>
          <Text className="text-base">Email: {user.email}</Text>
          {user.full_name && (
            <Text className="text-base">Full Name: {user.full_name}</Text>
          )}
          {user.role_id !== undefined && (
            <Text className="text-base">Role ID: {user.role_id}</Text>
          )}
          <Text className="text-base">
            Active: {user.is_active ? 'Yes' : 'No'}
          </Text>
        </View>
      ) : (
        <Text className="text-base text-red-500">No user data found.</Text>
      )}
    </View>
  );
};

export default PrivateScreen;
