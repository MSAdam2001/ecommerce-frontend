'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, logout } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password);
      if (data.user.role !== 'admin') {
        toast.error('Access denied. Admin only.');
        await logout();
        setLoading(false);
        return;
      }
      toast.success('Welcome back, Admin!');
      router.push('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '64px', height: '64px', background: '#FF6B00', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '2rem' }}>
            🔐
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#fff', margin: '0 0 4px 0' }}>Admin Portal</h1>
          <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>ShopZone Administration</p>
        </div>

        <div style={{ background: '#1f2937', borderRadius: '16px', border: '1px solid #374151', padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#9ca3af', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@shopzone.com"
                required
                style={{ width: '100%', border: '1px solid #374151', borderRadius: '10px', padding: '12px 16px', fontSize: '15px', color: '#fff', background: '#111827', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#9ca3af', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{ width: '100%', border: '1px solid #374151', borderRadius: '10px', padding: '12px 16px', fontSize: '15px', color: '#fff', background: '#111827', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', background: loading ? '#6b7280' : '#FF6B00', color: '#fff', border: 'none', borderRadius: '10px', padding: '13px', fontSize: '16px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Signing in...' : 'Sign In to Admin'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#111827', borderRadius: '10px', border: '1px solid #374151' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: 0, textAlign: 'center' }}>
              🔒 Restricted to authorized administrators only. Unauthorized access is logged.
            </p>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '14px', color: '#6b7280' }}>
          Not an admin?{' '}
          <a href="/" style={{ color: '#FF6B00', textDecoration: 'none', fontWeight: '600' }}>
            Go to Store
          </a>
        </p>

      </div>
    </div>
  );
}