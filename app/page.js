'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import ProductCard from '@/components/product/ProductCard';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [timer, setTimer] = useState({ hrs: '02', min: '14', sec: '35' });

  useEffect(() => {
    api.get('/products/featured').then(r => setFeatured(r.data.products)).catch(() => {});
    api.get('/categories').then(r => setCategories(r.data.categories)).catch(() => {});
  }, []);

  useEffect(() => {
    let total = 2 * 3600 + 14 * 60 + 35;
    const interval = setInterval(() => {
      total--;
      if (total <= 0) total = 8 * 3600;
      const h = String(Math.floor(total / 3600)).padStart(2, '0');
      const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
      const s = String(total % 60).padStart(2, '0');
      setTimer({ hrs: h, min: m, sec: s });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const categoryIcons = ['📱', '👗', '🏠', '💄', '⚽', '📚', '🎮', '🍕'];

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>

      <div style={{ background: 'linear-gradient(135deg, #FF6B00 0%, #FF8C00 100%)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 1rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '2rem' }}>
          <div style={{ color: '#fff' }}>
            <div style={{ display: 'inline-block', background: '#fff', color: '#FF6B00', fontSize: '12px', fontWeight: '700', padding: '4px 12px', borderRadius: '20px', marginBottom: '1rem' }}>
              FREE SHIPPING ON ALL ORDERS
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '800', color: '#fff', marginBottom: '1rem', lineHeight: 1.2 }}>
              Shop Smart,<br />Save More
            </h1>
            <p style={{ color: '#ffe0cc', fontSize: '1.1rem', marginBottom: '2rem', maxWidth: '400px' }}>
              Millions of products at unbeatable prices. Delivered to your door.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/products" style={{ background: '#fff', color: '#FF6B00', fontWeight: '700', padding: '12px 28px', borderRadius: '50px', textDecoration: 'none', fontSize: '15px' }}>
                Shop Now
              </Link>
              <Link href="/auth/register" style={{ border: '2px solid #fff', color: '#fff', fontWeight: '700', padding: '12px 28px', borderRadius: '50px', textDecoration: 'none', fontSize: '15px' }}>
                Join Free
              </Link>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '280px' }}>
            {[
              { label: 'Flash Sale', sub: 'Up to 90% off', bg: '#fff3e0', color: '#e65100' },
              { label: 'New Arrivals', sub: 'Fresh every day', bg: '#e3f2fd', color: '#1565c0' },
              { label: 'Free Ship', sub: 'All orders', bg: '#e8f5e9', color: '#2e7d32' },
              { label: 'Easy Return', sub: '30 day policy', bg: '#fce4ec', color: '#880e4f' }
            ].map((item, i) => (
              <div key={i} style={{ background: item.bg, borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                <p style={{ fontWeight: '700', fontSize: '13px', color: item.color, margin: '0 0 4px 0' }}>{item.label}</p>
                <p style={{ fontSize: '12px', color: item.color, opacity: 0.8, margin: 0 }}>{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem 1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', marginBottom: '1rem' }}>Shop by Category</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px' }}>
          {categories.length > 0 ? categories.slice(0, 8).map((cat, i) => (
            <Link key={cat._id} href={`/products?category=${cat._id}`}
              style={{ background: '#fff', borderRadius: '12px', padding: '12px 8px', textAlign: 'center', textDecoration: 'none', border: '1px solid #f3f4f6', transition: 'box-shadow 0.2s' }}>
              <div style={{ fontSize: '2rem', marginBottom: '6px' }}>{categoryIcons[i] || '🛍️'}</div>
              <p style={{ fontSize: '12px', fontWeight: '500', color: '#374151', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.name}</p>
            </Link>
          )) : ['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports', 'Books', 'Gaming', 'Food'].map((name, i) => (
            <Link key={i} href="/products"
              style={{ background: '#fff', borderRadius: '12px', padding: '12px 8px', textAlign: 'center', textDecoration: 'none', border: '1px solid #f3f4f6' }}>
              <div style={{ fontSize: '2rem', marginBottom: '6px' }}>{categoryIcons[i]}</div>
              <p style={{ fontSize: '12px', fontWeight: '500', color: '#374151', margin: 0 }}>{name}</p>
            </Link>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem 1.5rem' }}>
        <div style={{ background: '#1a1a1a', borderRadius: '16px', padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ color: '#FFC107', fontWeight: '800', fontSize: '15px', marginBottom: '4px', letterSpacing: '0.05em' }}>⚡ FLASH SALE</div>
            <h3 style={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: '800', margin: '0 0 4px 0' }}>Up to 90% OFF</h3>
            <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>Limited time deals on top products</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {[
              { value: timer.hrs, label: 'HRS' },
              { value: timer.min, label: 'MIN' },
              { value: timer.sec, label: 'SEC' }
            ].map((t, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ background: '#FF6B00', color: '#ffffff', borderRadius: '10px', padding: '10px 16px', fontSize: '1.75rem', fontWeight: '800', minWidth: '56px', textAlign: 'center', lineHeight: 1 }}>
                  {t.value}
                </div>
                <div style={{ color: '#9ca3af', fontSize: '11px', marginTop: '6px', fontWeight: '700', letterSpacing: '0.05em' }}>{t.label}</div>
              </div>
            ))}
          </div>
          <Link href="/products" style={{ background: '#FF6B00', color: '#ffffff', padding: '14px 28px', borderRadius: '10px', fontWeight: '700', textDecoration: 'none', fontSize: '15px', whiteSpace: 'nowrap' }}>
            Shop Now →
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', margin: '0 0 4px 0' }}>Featured Products</h2>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Handpicked deals just for you</p>
          </div>
          <Link href="/products" style={{ color: '#FF6B00', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>
            View all →
          </Link>
        </div>
        {featured.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#9ca3af' }}>
            <p style={{ marginBottom: '8px' }}>No featured products yet.</p>
            <Link href="/admin/products" style={{ color: '#FF6B00', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
              Add products in admin →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
            {featured.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem 3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          {[
            { icon: '🚚', title: 'Free Delivery', sub: 'On all orders worldwide' },
            { icon: '🔒', title: 'Secure Payment', sub: '100% protected by Stripe' },
            { icon: '↩️', title: '30 Day Returns', sub: 'No questions asked' }
          ].map((item, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #f3f4f6', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '2.5rem' }}>{item.icon}</div>
              <div>
                <p style={{ fontWeight: '600', color: '#111827', margin: '0 0 4px 0' }}>{item.title}</p>
                <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}