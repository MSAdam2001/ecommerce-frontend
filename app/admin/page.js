'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import useAuthStore from '@/store/authStore';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const router = useRouter();

  // ✅ FIX: wait for Zustand to rehydrate before checking role
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return; // ✅ don't check until store is ready

    if (!user || user.role !== 'admin') {
      router.push('/');
      return;
    }

    api.get('/admin/stats')
      .then(r => setStats(r.data.stats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, hydrated]);

  const statusColor = {
    processing: { bg: '#FFF3E0', color: '#E65100' },
    shipped: { bg: '#E3F2FD', color: '#1565C0' },
    delivered: { bg: '#E8F5E9', color: '#2E7D32' },
    cancelled: { bg: '#FFEBEE', color: '#C62828' }
  };

  // ✅ Show nothing while rehydrating to prevent flash redirect
  if (!hydrated) return null;

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
      <p style={{ color: '#6b7280' }}>Loading dashboard...</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '1rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.75rem)', fontWeight: '700', color: '#111827', margin: 0 }}>Admin Dashboard</h1>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: '4px 0 0 0' }}>Welcome back, {user?.name}</p>
          </div>
          <Link href="/admin/products" style={{ background: '#FF6B00', color: '#fff', padding: '10px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>
            + Add Product
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '1.5rem' }}>
          {[
            { label: 'Revenue', value: `$${stats?.totalRevenue?.toFixed(0) || 0}`, bg: '#FF6B00' },
            { label: 'Orders', value: stats?.totalOrders || 0, bg: '#2B5CE6' },
            { label: 'Products', value: stats?.totalProducts || 0, bg: '#00A651' },
            { label: 'Users', value: stats?.totalUsers || 0, bg: '#8B5CF6' }
          ].map((item, i) => (
            <div key={i} style={{ background: item.bg, borderRadius: '12px', padding: '1rem', color: '#fff' }}>
              <p style={{ fontSize: '12px', opacity: 0.8, margin: '0 0 4px 0' }}>{item.label}</p>
              <p style={{ fontSize: 'clamp(1.25rem, 4vw, 1.75rem)', fontWeight: '700', margin: 0 }}>{item.value}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '1.5rem' }}>
          {[
            { href: '/admin/orders', icon: '📦', label: 'Orders', sub: 'Manage & update' },
            { href: '/admin/products', icon: '🛍️', label: 'Products', sub: 'Add & edit' },
            { href: '/admin/categories', icon: '🗂️', label: 'Categories', sub: 'Organize' },
            { href: '/admin/users', icon: '👥', label: 'Users', sub: 'View & manage' }
          ].map(item => (
            <Link key={item.href} href={item.href} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1rem', textDecoration: 'none', display: 'block' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '6px' }}>{item.icon}</div>
              <p style={{ fontWeight: '600', color: '#111827', margin: '0 0 2px 0', fontSize: '14px' }}>{item.label}</p>
              <p style={{ color: '#9ca3af', fontSize: '12px', margin: 0 }}>{item.sub}</p>
            </Link>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: 0 }}>Recent Orders</h2>
            <Link href="/admin/orders" style={{ color: '#FF6B00', fontSize: '12px', textDecoration: 'none' }}>View all</Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '400px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <th style={{ textAlign: 'left', padding: '8px 4px', color: '#6b7280', fontWeight: '500' }}>Customer</th>
                  <th style={{ textAlign: 'left', padding: '8px 4px', color: '#6b7280', fontWeight: '500' }}>Total</th>
                  <th style={{ textAlign: 'left', padding: '8px 4px', color: '#6b7280', fontWeight: '500' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '8px 4px', color: '#6b7280', fontWeight: '500' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders?.map(order => (
                  <tr key={order._id} style={{ borderBottom: '1px solid #f9fafb' }}>
                    <td style={{ padding: '10px 4px', fontWeight: '500', color: '#111827' }}>{order.user?.name || 'Guest'}</td>
                    <td style={{ padding: '10px 4px', fontWeight: '600', color: '#FF6B00' }}>${order.totalPrice?.toFixed(2)}</td>
                    <td style={{ padding: '10px 4px' }}>
                      <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: '500', ...statusColor[order.orderStatus] }}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td style={{ padding: '10px 4px', color: '#9ca3af' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}