'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/axios';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      api.get(`/payment/verify/${sessionId}`)
        .then(res => {
          setOrder(res.data.order);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '2rem', maxWidth: '480px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#16a34a', marginBottom: '8px' }}>Payment Successful!</h1>
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Thank you for your order!</p>
        {order && (
          <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '1.5rem' }}>
            Order ID: #{order._id?.slice(-8).toUpperCase()}
          </p>
        )}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/products"
            style={{ background: '#FF6B00', color: '#fff', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}
          >
            Continue Shopping
          </Link>
          {order && (
            <Link
              href="/orders"
              style={{ border: '1px solid #FF6B00', color: '#FF6B00', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}
            >
              View Orders
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ color: '#6b7280' }}>Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}