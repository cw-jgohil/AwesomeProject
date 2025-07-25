import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { useCurrentUser } from '../../hooks/useAuth';

const HomeScreen = () => {
  const user = useAppStore(state => state.user);
  const { data: currentUser } = useCurrentUser();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const displayName = user?.full_name || user?.username || 'User';

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-6 pt-16 pb-8">
        {/* Header Section */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            {getGreeting()}!
          </Text>
          <Text className="text-xl text-gray-600">
            Welcome back, {displayName}
          </Text>
        </View>

        {/* Welcome Card */}
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <View className="flex-row items-center mb-4">
            <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
              <Text className="text-blue-600 text-2xl">👋</Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-900">
                Welcome to AwesomeProject!
              </Text>
              <Text className="text-gray-600">
                You're successfully logged in
              </Text>
            </View>
          </View>

          <Text className="text-gray-700 leading-6">
            Explore the app features and manage your profile using the tabs
            below. Have a great day!
          </Text>
        </View>

        {/* Quick Stats Card */}
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Quick Info
          </Text>

          <View className="space-y-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">Account Status</Text>
              <View className="bg-green-100 px-3 py-1 rounded-full">
                <Text className="text-green-800 text-sm font-medium">
                  {user?.is_active ? 'Active' : 'Inactive'}
                </Text>
              </View>
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">Login Type</Text>
              <Text className="text-gray-900 font-medium">
                {'Authenticated'}
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">Last Login</Text>
              <Text className="text-gray-900 font-medium">
                {new Date().toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
