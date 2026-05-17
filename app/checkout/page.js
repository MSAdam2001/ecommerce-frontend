'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setHydrated(true); }, []);

  const [form, setForm] = useState({
    fullName: '', address: '', city: '',
    postalCode: '', country: '', phone: ''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  if (!hydrated) return null;

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '1rem', background: '#f9fafb' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>Please login first</h2>
        <Link href="/auth/login" style={{ background: '#FF6B00', color: '#fff', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: '600' }}>Login</Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '1rem', background: '#f9fafb' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>Your cart is empty</h2>
        <Link href="/products" style={{ background: '#FF6B00', color: '#fff', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: '600' }}>Shop Now</Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderItems = items.map(item => ({
        product: item._id,
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity),
        image: item.images?.[0]?.url || ''
      }));
      const res = await api.post('/payment/create-checkout-session', {
        items: orderItems,
        shippingAddress: form
      });
      clearCart();
      window.location.href = res.data.sessionUrl;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#111827', marginBottom: '1.5rem' }}>Checkout</h1>

        {/* ✅ Fixed: auto-fit grid stacks to single column on mobile */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

          {/* Shipping form */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>Shipping Details</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { name: 'fullName',   placeholder: 'Full Name' },
                { name: 'address',    placeholder: 'Address' },
                { name: 'city',       placeholder: 'City' },
                { name: 'postalCode', placeholder: 'Postal Code' },
                { name: 'country',    placeholder: 'Country' },
                { name: 'phone',      placeholder: 'Phone Number' },
              ].map(({ name, placeholder }) => (
                <input
                  key={name}
                  name={name}
                  placeholder={placeholder}
                  value={form[name]}
                  onChange={handleChange}
                  required
                  style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.95rem', outline: 'none', width: '100%', boxSizing: 'border-box' }}
                />
              ))}
              <button
                type="submit"
                disabled={loading}
                style={{ marginTop: '0.5rem', background: '#FF6B00', color: '#fff', padding: '12px', borderRadius: '10px', border: 'none', fontWeight: '600', fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Redirecting to payment...' : 'Proceed to Payment'}
              </button>
            </form>
          </div>

          {/* Order summary */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', alignSelf: 'start' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>Order Summary</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {items.map(item => (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', color: '#374151' }}>
                  <span style={{ flex: 1, marginRight: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.name} × {item.quantity}
                  </span>
                  <span style={{ fontWeight: '600', flexShrink: 0 }}>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '0.5rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#6b7280' }}>
                <span>Shipping</span>
                <span style={{ color: '#16a34a', fontWeight: '600' }}>Free</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '1rem', color: '#111827' }}>
                <span>Total</span>
                <span style={{ color: '#FF6B00' }}>${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}