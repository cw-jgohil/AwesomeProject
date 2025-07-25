import { create } from 'zustand';
import type { User } from '../services/user/types';

interface AppState {
  count: number;
  increment: () => void;

  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),

  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
})); 