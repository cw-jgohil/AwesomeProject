import apiService, { ApiResponse, LoginData, LoginRequest } from './ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  role_id?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  isGuest?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

class AuthService {
  private static instance: AuthService;
  private authState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };

  private listeners: Array<(state: AuthState) => void> = [];

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Subscribe to auth state changes
  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.authState));
  }

  private setState(updates: Partial<AuthState>): void {
    this.authState = { ...this.authState, ...updates };
    this.notifyListeners();
  }

  // Get current auth state
  getAuthState(): AuthState {
    return { ...this.authState };
  }

  // Initialize auth state from storage
  async initialize(): Promise<void> {
    try {
      this.setState({ isLoading: true });
      
      const isAuthenticated = await apiService.isAuthenticated();
      if (isAuthenticated) {
        const userData = await apiService.getUserData();
        if (userData) {
          this.setState({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          // Token exists but no user data, clear tokens
          await this.logout();
        }
      } else {
        this.setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      this.setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Failed to initialize authentication',
      });
    }
  }

  // Login with username and password
  async login(username: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      this.setState({ isLoading: true, error: null });

      const loginRequest: LoginRequest = { username, password };
      const response: ApiResponse<LoginData> = await apiService.login(loginRequest);

      if (response.success && response.data) {
        const user: User = {
          ...response.data.user,
          isGuest: false,
        };

        this.setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        return { success: true, message: response.message };
      } else {
        this.setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: response.message,
        });

        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      this.setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });

      return { success: false, message: errorMessage };
    }
  }

  // Guest login
  async guest(): Promise<User> {
    const guestUser: User = {
      id: 0,
      username: 'Guest',
      email: 'guest@example.com',
      full_name: 'Guest User',
      is_active: true,
      isGuest: true,
    };

    this.setState({
      user: guestUser,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });

    return guestUser;
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }

  // Refresh user data
  async refreshUserData(): Promise<void> {
    try {
      const response = await apiService.getUserProfile();
      if (response.success && response.data) {
        const user: User = {
          ...response.data,
          isGuest: false,
        };
        this.setState({ user });
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.authState.isAuthenticated;
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.authState.user;
  }

  // Check if current user is guest
  isGuest(): boolean {
    return this.authState.user?.isGuest || false;
  }

  // Check if user has specific role
  hasRole(roleId: number): boolean {
    return this.authState.user?.role_id === roleId;
  }

  // Check if user is active
  isUserActive(): boolean {
    return this.authState.user?.is_active || false;
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();
export default authService; 