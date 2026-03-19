'use client';
import useCartStore from '@/store/cartStore';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '1rem', background: '#f9fafb' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>Your cart is empty</h2>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Add some products to get started</p>
        <Link href="/products" style={{ background: '#FF6B00', color: '#fff', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: '600' }}>
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '1rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h1 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.75rem)', fontWeight: '700', color: '#111827' }}>Your Cart</h1>
          <button onClick={clearCart} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
            Clear Cart
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1rem' }}>
          {items.map(item => (
            <div key={item._id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '64px', height: '64px', background: '#f9fafb', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                {item.images?.[0]?.url
                  ? <img src={item.images[0].url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>📦</div>
                }
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: '600', color: '#111827', fontSize: '14px', margin: '0 0 4px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                <p style={{ color: '#FF6B00', fontWeight: '700', fontSize: '15px', margin: 0 }}>${item.price}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                <button onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>-</button>
                <span style={{ width: '24px', textAlign: 'center', fontWeight: '600', fontSize: '14px' }}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
              </div>
              <div style={{ flexShrink: 0, textAlign: 'right' }}>
                <p style={{ fontWeight: '700', color: '#111827', fontSize: '14px', margin: '0 0 4px 0' }}>${(item.price * item.quantity).toFixed(2)}</p>
                <button onClick={() => removeItem(item._id)}
                  style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px' }}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#6b7280', fontSize: '14px' }}>Subtotal</span>
            <span style={{ fontWeight: '600', fontSize: '14px' }}>${getTotalPrice().toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: '#6b7280', fontSize: '14px' }}>Shipping</span>
            <span style={{ color: '#16a34a', fontWeight: '600', fontSize: '14px' }}>Free</span>
          </div>
          <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#111827' }}>Total</span>
            <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#FF6B00' }}>${getTotalPrice().toFixed(2)}</span>
          </div>
          <Link href="/checkout" style={{ display: 'block', width: '100%', background: '#FF6B00', color: '#fff', textAlign: 'center', padding: '14px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '16px', boxSizing: 'border-box' }}>
            Proceed to Checkout
          </Link>
          <Link href="/products" style={{ display: 'block', textAlign: 'center', color: '#6b7280', marginTop: '10px', fontSize: '13px', textDecoration: 'none' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}