'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import useAuthStore from '@/store/authStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    api.get('/orders/my-orders')
      .then(r => setOrders(r.data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const statusSteps = ['processing', 'shipped', 'delivered'];

  const statusColor = {
    processing: { bg: '#FFF3E0', color: '#E65100' },
    shipped: { bg: '#E3F2FD', color: '#1565C0' },
    delivered: { bg: '#E8F5E9', color: '#2E7D32' },
    cancelled: { bg: '#FFEBEE', color: '#C62828' }
  };

  const statusMessage = {
    processing: 'Your order is being prepared',
    shipped: 'Your order is on the way',
    delivered: 'Your order has been delivered',
    cancelled: 'Your order was cancelled'
  };

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '18px' }}>Loading orders...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#111827', marginBottom: '1.5rem' }}>My Orders</h1>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>No orders yet</h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Start shopping to see your orders here</p>
            <Link href="/products" style={{ background: '#FF6B00', color: '#fff', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: '600' }}>Shop Now</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map(order => (
              <div key={order._id} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 2px 0' }}>Order placed {new Date(order.createdAt).toLocaleDateString()}</p>
                    <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>ID: {order._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '1.25rem', fontWeight: '700', color: '#FF6B00', margin: '0 0 2px 0' }}>${order.totalPrice?.toFixed(2)}</p>
                    <span style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '20px', fontWeight: '500', ...statusColor[order.orderStatus] }}>
                      {order.paymentStatus === 'paid' ? 'Paid' : 'Pending payment'}
                    </span>
                  </div>
                </div>

                {order.orderStatus !== 'cancelled' && (
                  <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f3f4f6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '16px', left: '10%', right: '10%', height: '3px', background: '#f3f4f6', zIndex: 0 }}></div>
                      <div style={{ position: 'absolute', top: '16px', left: '10%', height: '3px', background: '#FF6B00', zIndex: 1, width: order.orderStatus === 'processing' ? '0%' : order.orderStatus === 'shipped' ? '50%' : '100%', transition: 'width 0.5s' }}></div>
                      {statusSteps.map((step, i) => {
                        const isActive = statusSteps.indexOf(order.orderStatus) >= i;
                        return (
                          <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, flex: 1 }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: isActive ? '#FF6B00' : '#f3f4f6', border: `3px solid ${isActive ? '#FF6B00' : '#e5e7eb'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '6px' }}>
                              <span style={{ fontSize: '14px' }}>{isActive ? '✓' : ''}</span>
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: isActive ? '600' : '400', color: isActive ? '#FF6B00' : '#9ca3af', textTransform: 'capitalize', textAlign: 'center' }}>{step}</span>
                          </div>
                        );
                      })}
                    </div>
                    <p style={{ textAlign: 'center', fontSize: '13px', color: '#6b7280', marginTop: '1rem' }}>
                      {statusMessage[order.orderStatus]}
                    </p>
                  </div>
                )}

                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f3f4f6' }}>
                  {order.items?.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '40px', height: '40px', background: '#f9fafb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                          {item.image ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} /> : '📦'}
                        </div>
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: '500', color: '#111827', margin: 0 }}>{item.name}</p>
                          <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p style={{ fontWeight: '600', color: '#111827' }}>${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>
                    Ship to: {order.shippingAddress?.fullName}, {order.shippingAddress?.city}, {order.shippingAddress?.country}
                  </div>
                  <Link href={`/orders/${order._id}`} style={{ color: '#FF6B00', fontSize: '14px', fontWeight: '500', textDecoration: 'none' }}>
                    View details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}