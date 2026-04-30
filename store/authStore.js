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

        // ✅ Save to Zustand state
        set({ user, token });

        // ✅ Save token + user to localStorage (so axios interceptor can read it)
        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user)); // ✅ ADDED — was missing
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        return res.data; // ✅ returns data so login page can read user.role
      },

      register: async (name, email, password) => {
        const res = await api.post('/auth/register', { name, email, password });
        const { user, token } = res.data;

        set({ user, token });

        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user)); // ✅ ADDED
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        return res.data;
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch (err) {}

        // ✅ Clear everything — token, user, axios header, zustand state
        localStorage.removeItem('token');
        localStorage.removeItem('user'); // ✅ ADDED — was missing
        delete api.defaults.headers.common['Authorization'];
        set({ user: null, token: null });
      },

      // ✅ FIXED — restores token AND sets axios header on page refresh
      loadToken: () => {
        const token = localStorage.getItem('token');
        const userRaw = localStorage.getItem('user');

        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        // ✅ Also restore user into Zustand if it got lost on refresh
        if (userRaw && !get().user) {
          try {
            const user = JSON.parse(userRaw);
            set({ user, token });
          } catch {}
        }
      },

      // ✅ NEW — handy helper used in protected route checks
      isAuthenticated: () => {
        return !!get().token;
      },

      // ✅ NEW — handy helper used in admin route checks
      isAdmin: () => {
        return get().user?.role === 'admin';
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);

export default useAuthStore;