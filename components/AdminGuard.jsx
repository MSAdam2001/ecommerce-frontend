'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';

export default function AdminGuard({ children }) {
  const { user, token } = useAuthStore();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Give Zustand a tick to rehydrate from localStorage on first load
    const timer = setTimeout(() => {
      if (!token || !user) {
        router.replace('/auth/login');
      } else if (user.role !== 'admin') {
        // Logged in but not admin — send to homepage
        router.replace('/');
      } else {
        setChecking(false);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [user, token, router]);

  if (checking) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f9fafb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #f3f4f6',
            borderTop: '3px solid #FF6B00',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>Verifying access...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return children;
}