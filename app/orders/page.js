'use client';
import { useEffect, useState, Suspense } from 'react';
import api from '@/lib/axios';
import useAuthStore from '@/store/authStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function OrdersContent() {
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

  const statusSteps = ['processing', 'shipped', 'delivered'];

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
      <p style={{ color: '#6b7280' }}>Loading your orders...</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '1rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.75rem)', fontWeight: '700', color: '#111827' }}>My Orders</h1>
          <Link href="/products" style={{ color: '#FF6B00', fontSize: '13px', textDecoration: 'none', fontWeight: '500' }}>Continue Shopping →</Link>
        </div>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>No orders yet</h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '14px' }}>Start shopping to see your orders here</p>
            <Link href="/products" style={{ background: '#FF6B00', color: '#fff', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>Shop Now</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map(order => (
              <div key={order._id} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', background: '#fff7ed', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <div>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 2px 0' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '1.1rem', fontWeight: '700', color: '#FF6B00', margin: '0 0 4px 0' }}>
                      ${order.totalPrice?.toFixed(2)}
                    </p>
                    <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: '500', background: order.paymentStatus === 'paid' ? '#E8F5E9' : '#FFF3E0', color: order.paymentStatus === 'paid' ? '#2E7D32' : '#E65100' }}>
                      {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                </div>

                {order.orderStatus !== 'cancelled' && (
                  <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative', marginBottom: '8px' }}>
                      <div style={{ position: 'absolute', top: '14px', left: '16px', right: '16px', height: '3px', background: '#f3f4f6' }}></div>
                      <div style={{ position: 'absolute', top: '14px', left: '16px', height: '3px', background: '#FF6B00', width: order.orderStatus === 'processing' ? '0%' : order.orderStatus === 'shipped' ? '50%' : '100%' }}></div>
                      {statusSteps.map((step, i) => {
                        const isActive = statusSteps.indexOf(order.orderStatus) >= i;
                        const isCurrent = order.orderStatus === step;
                        return (
                          <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, flex: 1 }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: isActive ? '#FF6B00' : '#f3f4f6', border: `3px solid ${isActive ? '#FF6B00' : '#e5e7eb'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '6px' }}>
                              <span style={{ fontSize: '12px', color: isActive ? '#fff' : '#9ca3af', fontWeight: '700' }}>{isActive ? '✓' : i + 1}</span>
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: isCurrent ? '700' : '400', color: isCurrent ? '#FF6B00' : '#9ca3af', textAlign: 'center', textTransform: 'capitalize' }}>{step}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '8px', padding: '6px 12px', background: '#fff7ed', borderRadius: '8px' }}>
                      <p style={{ fontSize: '12px', color: '#92400e', margin: 0 }}>{statusMessage[order.orderStatus]}</p>
                    </div>
                  </div>
                )}

                <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                  {order.items?.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0', borderBottom: i < order.items.length - 1 ? '1px solid #f9fafb' : 'none' }}>
                      <div style={{ width: '40px', height: '40px', background: '#f9fafb', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                        {item.image ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📦</div>}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '13px', fontWeight: '500', color: '#111827', margin: '0 0 2px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                        <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Qty: {item.quantity}</p>
                      </div>
                      <p style={{ fontWeight: '600', fontSize: '13px', flexShrink: 0 }}>${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div style={{ padding: '12px 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                    📍 {order.shippingAddress?.city}, {order.shippingAddress?.country}
                  </p>
                  <Link href={`/orders/${order._id}`} style={{ color: '#FF6B00', fontSize: '13px', fontWeight: '600', textDecoration: 'none', padding: '6px 12px', border: '1px solid #FF6B00', borderRadius: '8px' }}>
                    View Details
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

export default function MyOrdersPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: '#6b7280' }}>Loading...</p></div>}>
      <OrdersContent />
    </Suspense>
  );
}