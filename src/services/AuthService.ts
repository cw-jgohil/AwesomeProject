export interface User {
  id: string;
  username: string;
  isGuest: boolean;
}

export class AuthService {
  static async login(username: string, password: string): Promise<User | null> {
    // Simulate API call
    if (username === 'user' && password === 'password') {
      return { id: '1', username, isGuest: false };
    }
    return null;
  }

  static async guest(): Promise<User> {
    // Simulate guest login
    return { id: 'guest', username: 'Guest', isGuest: true };
  }
} 