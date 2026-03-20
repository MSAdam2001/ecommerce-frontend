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
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        return res.data;
      },

      register: async (name, email, password) => {
        const res = await api.post('/auth/register', { name, email, password });
        const { user, token } = res.data;
        set({ user, token });
        if (token) {
          localStorage.setItem('token', token);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        return res.data;
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch (err) {}
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        set({ user: null, token: null });
      },

      loadToken: () => {
        const token = localStorage.getItem('token');
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);

export default useAuthStore;