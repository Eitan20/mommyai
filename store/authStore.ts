import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Simulate API call - replace with actual API
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Mock authentication
        const user: User = {
          id: `user-${Date.now()}`,
          email,
          name: email.split('@')[0],
        };

        set({ user, isAuthenticated: true });
        return true;
      },

      signup: async (name: string, email: string, password: string) => {
        // Simulate API call - replace with actual API
        await new Promise((resolve) => setTimeout(resolve, 500));

        const user: User = {
          id: `user-${Date.now()}`,
          email,
          name,
        };

        set({ user, isAuthenticated: true });
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
