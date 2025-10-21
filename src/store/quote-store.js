import { create } from 'zustand';

export const useQuoteStore = create((set) => ({
  items: [],
  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),
  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    })),
  updateItem: (productId, updatedItem) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.productId === productId ? updatedItem : item
      ),
    })),
  clear: () => set({ items: [] }),
}));