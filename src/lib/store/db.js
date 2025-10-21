import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateUserId } from '@/lib/auth';

function createTestUsers() {
  return [
    {
      id: generateUserId(),
      email: 'admin@titanium.com',
      name: 'Admin User',
      role: 'ADMIN',
    },
    {
      id: generateUserId(),
      email: 'sales@titanium.com',
      name: 'Sales Representative',
      role: 'SALES',
    },
    {
      id: generateUserId(),
      email: 'customer@example.com',
      name: 'John Customer',
      company: 'Example Corp',
      role: 'CUSTOMER',
    },
  ];
}

export const useDB = create()(
  persist(
    (set, get) => ({
      users: [],
      initialized: false,
      initialize: async () => {
        if (!get().initialized) {
          const users = createTestUsers();
          set({ users, initialized: true });
        }
      },
    }),
    {
      name: 'quick-quote-db',
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