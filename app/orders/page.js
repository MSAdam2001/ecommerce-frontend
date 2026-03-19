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

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '18px' }}>
      Loading your orders...
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#111827' }}>My Orders</h1>
          <Link href="/products" style={{ color: '#FF6B00', fontSize: '14px', textDecoration: 'none', fontWeight: '500' }}>Continue Shopping →</Link>
        </div>

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

                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', background: '#fff7ed' }}>
                  <div>
                    <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 2px 0' }}>
                      Order placed {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
                      ID: #{order._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '1.25rem', fontWeight: '700', color: '#FF6B00', margin: '0 0 4px 0' }}>
                      ${order.totalPrice?.toFixed(2)}
                    </p>
                    <span style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '20px', fontWeight: '500', background: order.paymentStatus === 'paid' ? '#E8F5E9' : '#FFF3E0', color: order.paymentStatus === 'paid' ? '#2E7D32' : '#E65100' }}>
                      {order.paymentStatus === 'paid' ? 'Payment confirmed' : 'Pending payment'}
                    </span>
                  </div>
                </div>

                {order.orderStatus !== 'cancelled' && (
                  <div style={{ padding: '1.5rem', borderBottom: '1px solid #f3f4f6' }}>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>Order Tracking</p>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', height: '3px', background: '#f3f4f6', zIndex: 0 }}></div>
                      <div style={{
                        position: 'absolute', top: '16px', left: '16px', height: '3px', background: '#FF6B00', zIndex: 1,
                        width: order.orderStatus === 'processing' ? '0%' : order.orderStatus === 'shipped' ? '50%' : '100%',
                        transition: 'width 0.5s ease'
                      }}></div>
                      {statusSteps.map((step, i) => {
                        const isActive = statusSteps.indexOf(order.orderStatus) >= i;
                        const isCurrent = order.orderStatus === step;
                        return (
                          <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, flex: 1 }}>
                            <div style={{
                              width: '34px', height: '34px', borderRadius: '50%',
                              background: isActive ? '#FF6B00' : '#f3f4f6',
                              border: `3px solid ${isActive ? '#FF6B00' : '#e5e7eb'}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              marginBottom: '8px', transition: 'all 0.3s'
                            }}>
                              <span style={{ fontSize: '14px', color: isActive ? '#fff' : '#9ca3af', fontWeight: '700' }}>
                                {isActive ? '✓' : i + 1}
                              </span>
                            </div>
                            <span style={{
                              fontSize: '12px', fontWeight: isCurrent ? '700' : '400',
                              color: isCurrent ? '#FF6B00' : isActive ? '#374151' : '#9ca3af',
                              textTransform: 'capitalize', textAlign: 'center'
                            }}>
                              {step}
                            </span>
                            {isCurrent && (
                              <span style={{ fontSize: '10px', color: '#FF6B00', fontWeight: '600', marginTop: '2px' }}>← Current</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '1rem', padding: '8px 16px', background: '#fff7ed', borderRadius: '8px', border: '1px solid #fed7aa' }}>
                      <p style={{ fontSize: '13px', color: '#92400e', fontWeight: '500', margin: 0 }}>
                        {statusMessage[order.orderStatus]}
                      </p>
                    </div>
                  </div>
                )}

                {order.orderStatus === 'cancelled' && (
                  <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f3f4f6', background: '#fff5f5' }}>
                    <p style={{ color: '#C62828', fontSize: '14px', fontWeight: '500', margin: 0 }}>
                      This order was cancelled
                    </p>
                  </div>
                )}

                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f3f4f6' }}>
                  {order.items?.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < order.items.length - 1 ? '1px solid #f9fafb' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '44px', height: '44px', background: '#f9fafb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                          {item.image
                            ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <span style={{ fontSize: '22px' }}>📦</span>
                          }
                        </div>
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: '500', color: '#111827', margin: '0 0 2px 0' }}>{item.name}</p>
                          <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <p style={{ fontWeight: '600', color: '#111827', fontSize: '14px' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>
                    📍 {order.shippingAddress?.fullName}, {order.shippingAddress?.city}, {order.shippingAddress?.country}
                  </div>
                  <Link href={`/orders/${order._id}`} style={{ color: '#FF6B00', fontSize: '14px', fontWeight: '600', textDecoration: 'none', padding: '6px 14px', border: '1px solid #FF6B00', borderRadius: '8px' }}>
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
