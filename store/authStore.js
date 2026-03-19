import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      loading: false,

      register: async (name, email, password) => {
        set({ loading: true });
        const res = await api.post('/auth/register', { name, email, password });
        set({ user: res.data.user, loading: false });
        return res.data;
      },

      login: async (email, password) => {
        set({ loading: true });
        const res = await api.post('/auth/login', { email, password });
        set({ user: res.data.user, loading: false });
        return res.data;
      },

      logout: async () => {
        await api.post('/auth/logout');
        set({ user: null });
      },

      getMe: async () => {
        const res = await api.get('/auth/me');
        set({ user: res.data.user });
      }
    }),
    { name: 'auth-storage' }
  )
);

export default useAuthStore;