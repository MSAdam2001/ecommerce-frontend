import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const items = get().items;
        const existing = items.find(i => i._id === product._id);
        if (existing) {
          set({
            items: items.map(i =>
              i._id === product._id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            )
          });
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter(i => i._id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map(i =>
            i._id === id ? { ...i, quantity } : i
          )
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalPrice: () => {
        return get().items.reduce((total, i) => total + i.price * i.quantity, 0);
      },

      getTotalItems: () => {
        return get().items.reduce((total, i) => total + i.quantity, 0);
      }
    }),
    { name: 'cart-storage' }
  )
);

export default useCartStore;