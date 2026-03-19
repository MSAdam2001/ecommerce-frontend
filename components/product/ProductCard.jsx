'use client';
import Link from 'next/link';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import useCartStore from '@/store/cartStore';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addItem } = useCartStore();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product);
    toast.success(`${product.name} added to cart!`);
  };

  const discount = product.comparePrice > 0
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #f3f4f6', overflow: 'hidden', position: 'relative', transition: 'box-shadow 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      {discount > 0 && (
        <div style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 10, background: '#ef4444', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '6px' }}>
          -{discount}%
        </div>
      )}
      {product.stock <= 5 && product.stock > 0 && (
        <div style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 10, background: '#FF6B00', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '6px' }}>
          Only {product.stock} left!
        </div>
      )}
      {product.stock === 0 && (
        <div style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 10, background: '#6b7280', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '6px' }}>
          Sold Out
        </div>
      )}

      <Link href={`/products/${product._id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{ height: '180px', background: '#f9fafb', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {product.images?.[0]?.url ? (
            <img
              src={product.images[0].url}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div style={{ display: product.images?.[0]?.url ? 'none' : 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
            📦
          </div>
        </div>
      </Link>

      <div style={{ padding: '12px' }}>
        <Link href={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{ fontSize: '13px', fontWeight: '500', color: '#111827', marginBottom: '8px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.name}
          </h3>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '8px' }}>
          {[1,2,3,4,5].map(s => (
            <span key={s} style={{ fontSize: '10px', color: s <= Math.round(product.ratings || 4) ? '#FBBF24' : '#e5e7eb' }}>★</span>
          ))}
          <span style={{ fontSize: '11px', color: '#9ca3af', marginLeft: '4px' }}>({product.numReviews || 0})</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#FF6B00' }}>${product.price}</span>
            {product.comparePrice > 0 && (
              <span style={{ fontSize: '12px', color: '#9ca3af', textDecoration: 'line-through', marginLeft: '6px' }}>${product.comparePrice}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            style={{ background: '#FF6B00', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', opacity: product.stock === 0 ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          </button>
        </div>

       <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
  {product.sold > 0 && (
    <span style={{ fontSize: '11px', color: '#9ca3af' }}>{product.sold}+ sold</span>
  )}
  {product.isFeatured && (
    <span style={{ fontSize: '11px', background: '#fff7ed', color: '#FF6B00', padding: '2px 8px', borderRadius: '20px', fontWeight: '500' }}>
      Featured
    </span>
  )}
</div>
      </div>
    </div>
  );
}