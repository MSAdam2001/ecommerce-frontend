'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/axios';
import Link from 'next/link';

export default function OrderPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data.order);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="text-center py-20 text-gray-400">Loading order...</div>;
  if (!order) return <div className="text-center py-20 text-gray-400">Order not found</div>;

  const statusColors = {
    processing: 'bg-yellow-100 text-yellow-800',
    shipped: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">✅</div>
        <h1 className="text-3xl font-bold text-green-600">Order Placed!</h1>
        <p className="text-gray-500 mt-2">Order ID: {order._id}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Order Status</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.orderStatus]}`}>
            {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
          </span>
        </div>

        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">📦</div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-blue-600">${order.totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-3">Shipping Address</h2>
        <p className="text-gray-600">{order.shippingAddress.fullName}</p>
        <p className="text-gray-600">{order.shippingAddress.address}</p>
        <p className="text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.zipCode}</p>
        <p className="text-gray-600">{order.shippingAddress.country}</p>
        <p className="text-gray-600">{order.shippingAddress.phone}</p>
      </div>

      <div className="flex gap-4">
        <Link
          href="/products"
          className="flex-1 bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 font-semibold"
        >
          Continue Shopping
        </Link>
        <Link
          href="/orders/my-orders"
          className="flex-1 border border-blue-600 text-blue-600 text-center py-3 rounded-lg hover:bg-blue-50 font-semibold"
        >
          My Orders
        </Link>
      </div>
    </div>
  );
}