'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/axios';
import Link from 'next/link';

export default function SuccessPage() {
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
    }
  }, [sessionId]);

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Verifying payment...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="text-6xl mb-4">🎉</div>
      <h1 className="text-3xl font-bold mb-2 text-green-600">Payment Successful!</h1>
      <p className="text-gray-500 mb-2">Thank you for your order!</p>
      {order && (
        <p className="text-gray-400 text-sm mb-6">Order ID: {order._id}</p>
      )}
      <div className="flex gap-4">
        <Link
          href="/products"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Continue Shopping
        </Link>
        {order && (
          <Link
            href={`/orders/${order._id}`}
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50"
          >
            View Order
          </Link>
        )}
      </div>
    </div>
  );
}