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
import { authService } from '../../services/AuthService';
import { useToast } from '../../contexts/ToastContext';
import Icon from 'react-native-vector-icons/Ionicons';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authState, setAuthState] = useState(authService.getAuthState());

  const { login } = useAppStore();
  const { showToast } = useToast();

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = authService.subscribe(setAuthState);
    return unsubscribe;
  }, []);

  // Initialize auth on mount
  useEffect(() => {
    authService.initialize();
  }, []);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      showToast('Please enter both username and password', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const result = await authService.login(username.trim(), password);

      if (result.success) {
        showToast('Login successful!', 'success');
        login(authState.user!);
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
      } else {
        showToast(result.message, 'error');
      }
    } catch (error) {
      showToast('An unexpected error occurred', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuest = async () => {
    try {
      const user = await authService.guest();
      login(user);
      showToast('Welcome as Guest!', 'info');
      navigation.reset({ index: 0, routes: [{ name: 'Public' }] });
    } catch (error) {
      showToast('Failed to login as guest', 'error');
    }
  };

  const handlePublic = () => {
    navigation.reset({ index: 0, routes: [{ name: 'Public' }] });
  };

  const isFormValid = username.trim().length > 0 && password.trim().length > 0;

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
