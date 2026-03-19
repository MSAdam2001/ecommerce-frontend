'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchOrders = async () => {
    try {
      const res = await api.get('/admin/orders');
      setOrders(res.data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id, orderStatus) => {
    try {
      await api.put(`/admin/orders/${id}`, { orderStatus });
      toast.success('Order updated!');
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  const statusColor = {
    processing: { bg: '#FFF3E0', color: '#E65100' },
    shipped: { bg: '#E3F2FD', color: '#1565C0' },
    delivered: { bg: '#E8F5E9', color: '#2E7D32' },
    cancelled: { bg: '#FFEBEE', color: '#C62828' }
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.orderStatus === filter);

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '1rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
          <h1 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', fontWeight: '700', color: '#111827' }}>Manage Orders</h1>
          <Link href="/admin" style={{ color: '#FF6B00', fontSize: '13px', textDecoration: 'none' }}>← Dashboard</Link>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '4px' }}>
          {['all', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              style={{ padding: '8px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', border: '1px solid', cursor: 'pointer', whiteSpace: 'nowrap', background: filter === s ? '#FF6B00' : '#fff', color: filter === s ? '#fff' : '#374151', borderColor: filter === s ? '#FF6B00' : '#e5e7eb' }}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>No orders found</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map(order => (
              <div key={order._id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <p style={{ fontWeight: '600', color: '#111827', margin: '0 0 2px 0', fontSize: '14px' }}>{order.user?.name || 'Guest'}</p>
                    <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 2px 0' }}>{order.user?.email}</p>
                    <p style={{ color: '#9ca3af', fontSize: '11px', margin: 0 }}>{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '1.1rem', fontWeight: '700', color: '#FF6B00', margin: '0 0 4px 0' }}>${order.totalPrice?.toFixed(2)}</p>
                    <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: '500', background: order.paymentStatus === 'paid' ? '#E8F5E9' : '#FFF3E0', color: order.paymentStatus === 'paid' ? '#2E7D32' : '#E65100' }}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '10px', marginBottom: '10px' }}>
                  {order.items?.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '3px 0' }}>
                      <span style={{ color: '#374151' }}>{item.name} × {item.quantity}</span>
                      <span style={{ fontWeight: '500' }}>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '20px', fontWeight: '500', ...statusColor[order.orderStatus] }}>
                    {order.orderStatus}
                  </span>
                  <select value={order.orderStatus} onChange={(e) => updateStatus(order._id, e.target.value)}
                    style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '6px 10px', fontSize: '13px', color: '#374151', background: '#fff', cursor: 'pointer', outline: 'none' }}>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <p style={{ fontSize: '11px', color: '#9ca3af', margin: '8px 0 0 0' }}>
                  Ship to: {order.shippingAddress?.fullName}, {order.shippingAddress?.city}, {order.shippingAddress?.country}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}