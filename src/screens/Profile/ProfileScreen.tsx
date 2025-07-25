import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppStore } from '../../store/useAppStore';
import { useLogout } from '../../services/auth/useLogout';
import { useCurrentUser, useUserProfile } from '../../hooks/useAuth';
import { User } from '../../services/user/types';
import { useNavigation } from '@react-navigation/native';
import SessionManagement from '../../components/SessionManagement';

const ProfileScreen = () => {
  const user = useAppStore(state => state.user);
  const { data: currentUser } = useCurrentUser();
  const { data: userProfile } = useUserProfile();
  const logoutMutation = useLogout();
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          logoutMutation.mutate(undefined, {
            onSuccess: () => {
              navigation.navigate('Login' as never);
            },
          });
        },
      },
    ]);
  };

  const displayName = user?.full_name || user?.username || 'User';
  // Helper to extract user data from ApiResponse or User
  const extractUser = (data: any): User | null => {
    if (!data) return null;
    if ('id' in data && 'username' in data) return data as User;
    if ('data' in data && data.data && 'id' in data.data)
      return data.data as User;
    return null;
  };
  const profileData = extractUser(userProfile) || user;

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-6 pt-16 pb-8">
        {/* Header Section */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 bg-blue-500 rounded-full items-center justify-center mb-4">
            <Text className="text-white text-3xl font-bold">
              {displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-1">
            {displayName}
          </Text>
          <Text className="text-gray-600">
            {profileData?.email || 'No email provided'}
          </Text>
        </View>

        {/* Profile Details Card */}
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Profile Details
          </Text>

          <View className="space-y-4">
            <View className="flex-row items-center">
              <Icon name="person-outline" size={20} color="#6B7280" />
              <View className="ml-3 flex-1">
                <Text className="text-gray-600 text-sm">Username</Text>
                <Text className="text-gray-900 font-medium">
                  {profileData?.username || 'Not available'}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <Icon name="mail-outline" size={20} color="#6B7280" />
              <View className="ml-3 flex-1">
                <Text className="text-gray-600 text-sm">Email</Text>
                <Text className="text-gray-900 font-medium">
                  {profileData?.email || 'Not available'}
                </Text>
              </View>
            </View>

            {profileData?.full_name && (
              <View className="flex-row items-center">
                <Icon name="person-circle-outline" size={20} color="#6B7280" />
                <View className="ml-3 flex-1">
                  <Text className="text-gray-600 text-sm">Full Name</Text>
                  <Text className="text-gray-900 font-medium">
                    {profileData.full_name}
                  </Text>
                </View>
              </View>
            )}

            <View className="flex-row items-center">
              <Icon name="shield-checkmark-outline" size={20} color="#6B7280" />
              <View className="ml-3 flex-1">
                <Text className="text-gray-600 text-sm">Account Status</Text>
                <View className="flex-row items-center">
                  <View
                    className={`px-2 py-1 rounded-full ${profileData?.is_active ? 'bg-green-100' : 'bg-red-100'}`}
                  >
                    <Text
                      className={`text-xs font-medium ${profileData?.is_active ? 'text-green-800' : 'text-red-800'}`}
                    >
                      {profileData?.is_active ? 'Active' : 'Inactive'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {profileData?.role_id !== undefined && (
              <View className="flex-row items-center">
                <Icon name="key-outline" size={20} color="#6B7280" />
                <View className="ml-3 flex-1">
                  <Text className="text-gray-600 text-sm">Role ID</Text>
                  <Text className="text-gray-900 font-medium">
                    {profileData.role_id}
                  </Text>
                </View>
              </View>
            )}

            {profileData?.created_at && (
              <View className="flex-row items-center">
                <Icon name="calendar-outline" size={20} color="#6B7280" />
                <View className="ml-3 flex-1">
                  <Text className="text-gray-600 text-sm">Member Since</Text>
                  <Text className="text-gray-900 font-medium">
                    {new Date(profileData.created_at).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Account Settings Card */}
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Account Settings
          </Text>

          <TouchableOpacity
            className="flex-row items-center justify-between py-3"
            onPress={() =>
              Alert.alert('Feature', 'Edit profile feature coming soon!')
            }
          >
            <View className="flex-row items-center">
              <Icon name="create-outline" size={20} color="#6B7280" />
              <Text className="ml-3 text-gray-900 font-medium">
                Edit Profile
              </Text>
            </View>
            <Icon name="chevron-forward-outline" size={20} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-between py-3"
            onPress={() =>
              Alert.alert('Feature', 'Privacy settings feature coming soon!')
            }
          >
            <View className="flex-row items-center">
              <Icon name="lock-closed-outline" size={20} color="#6B7280" />
              <Text className="ml-3 text-gray-900 font-medium">
                Privacy Settings
              </Text>
            </View>
            <Icon name="chevron-forward-outline" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Session Management Section */}
        <SessionManagement />

        {/* Logout Button */}
        <TouchableOpacity
          className="bg-red-500 rounded-2xl p-4 items-center mt-6"
          onPress={handleLogout}
          disabled={logoutMutation.isPending}
        >
          <View className="flex-row items-center">
            <Icon name="log-out-outline" size={20} color="white" />
            <Text className="text-white font-semibold ml-2">
              {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
