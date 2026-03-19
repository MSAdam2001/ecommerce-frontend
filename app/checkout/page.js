'use client';
import { useState } from 'react';
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
  const [form, setForm] = useState({
    fullName: '', address: '', city: '',
    postalCode: '', country: '', phone: ''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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

  const inputStyle = {
    width: '100%', border: '1px solid #e5e7eb', borderRadius: '10px',
    padding: '12px 14px', fontSize: '16px', color: '#111827',
    background: '#fff', boxSizing: 'border-box', outline: 'none'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '1rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.75rem)', fontWeight: '700', color: '#111827', marginBottom: '1.5rem' }}>Checkout</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.25rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>Shipping Information</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { name: 'fullName', label: 'Full Name', placeholder: 'John Doe', type: 'text' },
                { name: 'address', label: 'Address', placeholder: '123 Main Street', type: 'text' },
                { name: 'city', label: 'City', placeholder: 'New York', type: 'text' },
                { name: 'postalCode', label: 'Postal Code', placeholder: '10001', type: 'text' },
                { name: 'country', label: 'Country', placeholder: 'United States', type: 'text' },
                { name: 'phone', label: 'Phone', placeholder: '+1 234 567 8900', type: 'tel' },
              ].map(field => (
                <div key={field.name}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>{field.label}</label>
                  <input name={field.name} type={field.type} value={form[field.name]} onChange={handleChange} required placeholder={field.placeholder} style={inputStyle} />
                </div>
              ))}
              <button type="submit" disabled={loading}
                style={{ width: '100%', background: loading ? '#9ca3af' : '#FF6B00', color: '#fff', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '16px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '8px' }}>
                {loading ? 'Redirecting...' : `Pay $${getTotalPrice().toFixed(2)} with Stripe`}
              </button>
            </form>
          </div>

          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.25rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>Order Summary</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1rem' }}>
              {items.map(item => (
                <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '48px', height: '48px', background: '#f9fafb', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                    {item.images?.[0]?.url
                      ? <img src={item.images[0].url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📦</div>
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '13px', fontWeight: '500', color: '#111827', margin: '0 0 2px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                    <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Qty: {item.quantity}</p>
                  </div>
                  <p style={{ fontWeight: '600', fontSize: '13px', flexShrink: 0 }}>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>Subtotal</span>
                <span style={{ fontSize: '13px', fontWeight: '600' }}>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>Shipping</span>
                <span style={{ fontSize: '13px', color: '#16a34a', fontWeight: '600' }}>Free</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '1rem', fontWeight: '700' }}>Total</span>
                <span style={{ fontSize: '1rem', fontWeight: '700', color: '#FF6B00' }}>${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}