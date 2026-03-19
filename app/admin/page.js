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

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = {
    processing: { bg: '#FFF3E0', color: '#E65100' },
    shipped: { bg: '#E3F2FD', color: '#1565C0' },
    delivered: { bg: '#E8F5E9', color: '#2E7D32' },
    cancelled: { bg: '#FFEBEE', color: '#C62828' }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-gray-400 text-xl">Loading dashboard...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, {user?.name}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/orders" className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium">
              Manage Orders
            </Link>
            <Link href="/admin/products" className="text-white px-4 py-2 rounded-lg text-sm font-medium" style={{ background: '#FF6B00' }}>
              Add Product
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="text-white rounded-xl p-5" style={{ background: '#FF6B00' }}>
            <p className="text-sm opacity-80 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold">${stats?.totalRevenue?.toFixed(2) || '0.00'}</p>
            <p className="text-xs opacity-70 mt-1">From paid orders</p>
          </div>
          <div className="text-white rounded-xl p-5" style={{ background: '#2B5CE6' }}>
            <p className="text-sm opacity-80 mb-1">Total Orders</p>
            <p className="text-2xl font-bold">{stats?.totalOrders || 0}</p>
            <p className="text-xs opacity-70 mt-1">All time</p>
          </div>
          <div className="text-white rounded-xl p-5" style={{ background: '#00A651' }}>
            <p className="text-sm opacity-80 mb-1">Total Products</p>
            <p className="text-2xl font-bold">{stats?.totalProducts || 0}</p>
            <p className="text-xs opacity-70 mt-1">{stats?.lowStockProducts?.length || 0} low stock</p>
          </div>
          <div className="text-white rounded-xl p-5" style={{ background: '#8B5CF6' }}>
            <p className="text-sm opacity-80 mb-1">Total Users</p>
            <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
            <p className="text-xs opacity-70 mt-1">Registered users</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Orders</h2>
              <Link href="/admin/orders" className="text-sm text-blue-600 hover:underline">View all</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 text-gray-500 font-medium">Customer</th>
                    <th className="text-left py-3 text-gray-500 font-medium">Total</th>
                    <th className="text-left py-3 text-gray-500 font-medium">Status</th>
                    <th className="text-left py-3 text-gray-500 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentOrders?.map(order => (
                    <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 font-medium">{order.user?.name || 'Guest'}</td>
                      <td className="py-3 font-semibold">${order.totalPrice?.toFixed(2)}</td>
                      <td className="py-3">
                        <span className="px-3 py-1 rounded-full text-xs font-medium" style={statusColor[order.orderStatus]}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Order Status</h2>
              <div className="space-y-3">
                {stats?.ordersByStatus?.map(s => (
                  <div key={s._id} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">{s._id}</span>
                    <span className="text-sm font-semibold px-3 py-1 rounded-full" style={statusColor[s._id]}>
                      {s.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Low Stock Alert</h2>
              <div className="space-y-3">
                {stats?.lowStockProducts?.length === 0 && (
                  <p className="text-gray-400 text-sm">All products well stocked</p>
                )}
                {stats?.lowStockProducts?.map(p => (
                  <div key={p._id} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{p.name}</span>
                    <span className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{ background: p.stock <= 5 ? '#FFEBEE' : '#FFF3E0', color: p.stock <= 5 ? '#C62828' : '#E65100' }}>
                      {p.stock} left
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/admin/orders" className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition text-center">
            <div className="text-3xl mb-2">📦</div>
            <p className="font-semibold text-gray-800">Orders</p>
            <p className="text-gray-400 text-sm">Manage & update</p>
          </Link>
          <Link href="/admin/products" className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition text-center">
            <div className="text-3xl mb-2">🛍️</div>
            <p className="font-semibold text-gray-800">Products</p>
            <p className="text-gray-400 text-sm">Add & edit</p>
          </Link>
          <Link href="/admin/categories" className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition text-center">
            <div className="text-3xl mb-2">🗂️</div>
            <p className="font-semibold text-gray-800">Categories</p>
            <p className="text-gray-400 text-sm">Organize store</p>
          </Link>
          <Link href="/admin/users" className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition text-center">
            <div className="text-3xl mb-2">👥</div>
            <p className="font-semibold text-gray-800">Users</p>
            <p className="text-gray-400 text-sm">View & manage</p>
          </Link>
        </div>

      </div>
    </div>
  );
}