'use client';
import Link from 'next/link';
import useCartStore from '@/store/cartStore';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addItem } = useCartStore();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product);

    // Custom toast with product image — looks professional
    toast.custom((t) => (
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        background: '#fff', padding: '12px 16px', borderRadius: '14px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 0 1px rgba(0,0,0,0.06)',
        opacity: t.visible ? 1 : 0,
        transform: t.visible ? 'translateY(0)' : 'translateY(-8px)',
        transition: 'all 0.3s ease',
        minWidth: '260px', maxWidth: '320px'
      }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '10px',
          overflow: 'hidden', flexShrink: 0, background: '#f9fafb'
        }}>
          {product.images?.[0]?.url
            ? <img src={product.images[0].url} alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ width: '100%', height: '100%', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>📦</div>
          }
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: '600', fontSize: '13px', color: '#111827',
            margin: '0 0 2px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {product.name}
          </p>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Added to cart ✓</p>
        </div>
        <span style={{ fontSize: '14px', fontWeight: '700', color: '#FF6B00', flexShrink: 0 }}>
          ${product.price}
        </span>
      </div>
    ), { duration: 2500 });
  };

  const discount = product.comparePrice > 0
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '16px',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 0 1px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.25s ease, transform 0.25s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(255,107,0,0.15), 0 2px 8px rgba(0,0,0,0.08)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06), 0 0 1px rgba(0,0,0,0.04)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Badges */}
      {discount > 0 && (
        <div style={{
          position: 'absolute', top: '10px', left: '10px', zIndex: 10,
          background: '#ef4444', color: '#fff', fontSize: '11px',
          fontWeight: '700', padding: '3px 8px', borderRadius: '6px',
          letterSpacing: '0.02em'
        }}>
          -{discount}%
        </div>
      )}
      {product.stock <= 5 && product.stock > 0 && (
        <div style={{
          position: 'absolute', top: '10px', right: '10px', zIndex: 10,
          background: '#FF6B00', color: '#fff', fontSize: '11px',
          fontWeight: '700', padding: '3px 8px', borderRadius: '6px'
        }}>
          Only {product.stock} left!
        </div>
      )}
      {product.stock === 0 && (
        <div style={{
          position: 'absolute', top: '10px', right: '10px', zIndex: 10,
          background: '#6b7280', color: '#fff', fontSize: '11px',
          fontWeight: '700', padding: '3px 8px', borderRadius: '6px'
        }}>
          Sold Out
        </div>
      )}

      {/* Image */}
      <Link href={`/products/${product._id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{
          height: '190px', background: '#f9fafb', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative'
        }}>
          {product.images?.[0]?.url ? (
            <img
              src={product.images[0].url}
              alt={product.name}
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                transition: 'transform 0.4s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div style={{
            display: product.images?.[0]?.url ? 'none' : 'flex',
            width: '100%', height: '100%',
            alignItems: 'center', justifyContent: 'center', fontSize: '4rem'
          }}>
            📦
          </div>
        </div>
      </Link>

      {/* Content */}
      <div style={{ padding: '14px' }}>
        <Link href={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{
            fontSize: '13px', fontWeight: '600', color: '#111827',
            marginBottom: '8px', lineHeight: 1.4,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
            letterSpacing: '-0.01em'
          }}>
            {product.name}
          </h3>
        </Link>

        {/* Stars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '10px' }}>
          {[1,2,3,4,5].map(s => (
            <span key={s} style={{
              fontSize: '11px',
              color: s <= Math.round(product.ratings || 4) ? '#FBBF24' : '#e5e7eb'
            }}>★</span>
          ))}
          <span style={{ fontSize: '11px', color: '#9ca3af', marginLeft: '4px' }}>
            ({product.numReviews || 0})
          </span>
        </div>

        {/* Price + Cart button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#FF6B00', letterSpacing: '-0.02em' }}>
              ${product.price}
            </span>
            {product.comparePrice > 0 && (
              <span style={{ fontSize: '12px', color: '#9ca3af', textDecoration: 'line-through', marginLeft: '6px' }}>
                ${product.comparePrice}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            style={{
              background: product.stock === 0 ? '#e5e7eb' : '#FF6B00',
              color: product.stock === 0 ? '#9ca3af' : '#fff',
              border: 'none', borderRadius: '10px', padding: '9px 10px',
              cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={e => {
              if (product.stock > 0) {
                e.currentTarget.style.background = '#e55f00';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,107,0,0.4)';
                e.currentTarget.style.transform = 'scale(1.08)';
              }
            }}
            onMouseLeave={e => {
              if (product.stock > 0) {
                e.currentTarget.style.background = '#FF6B00';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </button>
        </div>

        {/* Sold + Featured */}
        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {product.sold > 0 && (
            <span style={{ fontSize: '11px', color: '#9ca3af' }}>{product.sold}+ sold</span>
          )}
          {product.isFeatured && (
            <span style={{
              fontSize: '11px', background: '#fff7ed', color: '#FF6B00',
              padding: '2px 8px', borderRadius: '20px', fontWeight: '600',
              border: '1px solid #fed7aa'
            }}>
              ⭐ Featured
            </span>
          )}
        </div>
      </div>
    </div>
  );
}