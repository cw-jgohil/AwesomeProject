import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/RootStack';
import { useAppStore } from '../../store/useAppStore';
import { useLogin, useIsAuthenticated } from '../../services';
import { useToast } from '../../contexts/ToastContext';
import Icon from 'react-native-vector-icons/Ionicons';
import type { ApiResponse, LoginData } from '../../services/auth/types';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAppStore();
  const { showToast } = useToast();

  // Destructure mutateAsync and isPending from useLogin
  const { mutateAsync: loginMutateAsync, isPending: isLoading } = useLogin({
    onSuccess: (result: ApiResponse<LoginData>) => {
      if (result.success && result.data) {
        showToast('Login successful!', 'success');
        login(result.data.user);
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
      } else {
        showToast(result.message, 'error');
      }
    },
    onError: () => {
      showToast('An unexpected error occurred', 'error');
    },
  });
  const { data: isAuthenticated } = useIsAuthenticated();

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    }
  }, [isAuthenticated, navigation]);

  // No try/catch needed, errors handled in onError
  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      showToast('Please enter both username and password', 'warning');
      return;
    }
    await loginMutateAsync({
      username: username.trim(),
      password,
    });
  };

  const handleGuest = async () => {
    // For now, we'll use a mock user for guest login
    const guestUser = {
      id: 0,
      username: 'guest',
      email: 'guest@example.com',
      full_name: 'Guest User',
      role_id: 0,
      is_active: true,
    };

    login(guestUser);
    showToast('Welcome as Guest!', 'info');
    navigation.reset({ index: 0, routes: [{ name: 'Public' }] });
  };

  const handlePublic = () => {
    navigation.reset({ index: 0, routes: [{ name: 'Public' }] });
  };

  const isFormValid = username.trim().length > 0 && password.trim().length > 0;
  // Replace all loginMutation.isPending with isLoading
  // const isLoading = loginMutation.isPending;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center items-center bg-white px-6">
          {/* Header */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-blue-500 rounded-full items-center justify-center mb-4">
              <Icon name="person" size={40} color="white" />
            </View>
            <Text className="text-3xl font-bold text-gray-800 mb-2">
              Welcome Back
            </Text>
            <Text className="text-gray-600 text-center">
              Sign in to your account to continue
            </Text>
          </View>

          {/* Login Form */}
          <View className="w-full space-y-4">
            {/* Username Input */}
            <View>
              <Text className="text-gray-700 font-medium mb-2">Username</Text>
              <View className="relative">
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 pl-12 text-gray-800 bg-gray-50"
                  placeholder="Enter your username"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
                <Icon
                  name="person-outline"
                  size={20}
                  color="#6B7280"
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: 12,
                  }}
                />
              </View>
            </View>

            {/* Password Input */}
            <View>
              <Text className="text-gray-700 font-medium mb-2">Password</Text>
              <View className="relative">
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 pl-12 pr-12 text-gray-800 bg-gray-50"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
                <Icon
                  name="lock-closed-outline"
                  size={20}
                  color="#6B7280"
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: 12,
                  }}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: 12,
                  }}
                  disabled={isLoading}
                >
                  <Icon
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              className={`rounded-lg py-3 mt-6 ${
                isFormValid && !isLoading ? 'bg-blue-500' : 'bg-gray-300'
              }`}
              onPress={handleLogin}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <View className="flex-row items-center justify-center">
                  <ActivityIndicator size="small" color="white" />
                  <Text className="text-white font-semibold ml-2">
                    Signing In...
                  </Text>
                </View>
              ) : (
                <Text className="text-white font-semibold text-center text-lg">
                  Sign In
                </Text>
              )}
            </TouchableOpacity>

            {/* Alternative Options */}
            <View className="mt-6 space-y-3">
              <TouchableOpacity
                className="border border-gray-300 rounded-lg py-3"
                onPress={handleGuest}
                disabled={isLoading}
              >
                <Text className="text-gray-700 font-medium text-center">
                  Continue as Guest
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="border border-gray-300 rounded-lg py-3"
                onPress={handlePublic}
                disabled={isLoading}
              >
                <Text className="text-gray-700 font-medium text-center">
                  View Public Page
                </Text>
              </TouchableOpacity>
            </View>

            {/* Help Text */}
            <View className="mt-8">
              <Text className="text-gray-500 text-center text-sm">
                Don't have an account?{' '}
                <Text className="text-blue-500 font-medium">
                  Contact your administrator
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
