import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { validatePassword, generateToken } from '@/lib/auth';
import { useDB } from '@/lib/store/db';

export const useAuthStore = create()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (email, password) => {
        try {
          const { users } = useDB.getState();
          const user = users.find((u) => u.email === email);
          
          if (!user) {
            throw new Error('Invalid credentials');
          }

          if (!validatePassword(password)) {
            throw new Error('Invalid credentials');
          }

          const token = generateToken();

          set({
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              company: user.company,
            },
            token,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Login error:', error);
          throw error;
        }
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
      updateUser: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },
    }),
    {
      name: 'auth-storage',
      storage: {
        getItem: (name) => {
          const str = sessionStorage.getItem(name);
          if (!str) return null;
          try {
            return JSON.parse(str);
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        },
      },
    }
  )
);