// store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      login: async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        const { user, token } = res.data;

        set({ user, token });

        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        return res.data; // caller uses data.user.role to decide where to redirect
      },

      register: async (name, email, password) => {
        const res = await api.post('/auth/register', { name, email, password });
        const { user, token } = res.data;

        set({ user, token });

        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        return res.data;
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch (err) {}

        // ✅ Clear cart store before wiping auth
        try {
          const { default: useCartStore } = await import('@/store/cartStore');
          useCartStore.getState().clearCart();
        } catch (err) {}

        // ✅ Clear all auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('cart-storage'); // belt-and-suspenders cart clear
        delete api.defaults.headers.common['Authorization'];
        set({ user: null, token: null });
      },

      loadToken: () => {
        const token = localStorage.getItem('token');
        const userRaw = localStorage.getItem('user');

        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        if (userRaw && !get().user) {
          try {
            const user = JSON.parse(userRaw);
            set({ user, token });
          } catch {}
        }
      },

      isAuthenticated: () => !!get().token,
      isAdmin: () => get().user?.role === 'admin',
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);

export default useAuthStore;