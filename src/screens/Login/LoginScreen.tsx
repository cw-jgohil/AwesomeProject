import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/RootStack';
import { useAppStore } from '@store/useAppStore';
import { AuthService } from '@services/AuthService';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAppStore();

  const handleLogin = async () => {
    const user = await AuthService.login(username, password);
    if (user) {
      login(user);
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } else {
      Alert.alert('Invalid credentials');
    }
  };

  const handleGuest = async () => {
    const user = await AuthService.guest();
    login(user);
    navigation.reset({ index: 0, routes: [{ name: 'Public' }] });
  };

  const handlePublic = () => {
    navigation.reset({ index: 0, routes: [{ name: 'Public' }] });
  };

  return (
    <View className="flex-1 justify-center items-center bg-white px-4">
      <Text className="text-2xl font-bold mb-6 text-primary">Login</Text>
      <TextInput
        className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <TouchableOpacity className="mt-4" onPress={handleGuest}>
        <Text className="text-blue-500">Continue as Guest</Text>
      </TouchableOpacity>
      <TouchableOpacity className="mt-2" onPress={handlePublic}>
        <Text className="text-blue-500">View Public Page</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
