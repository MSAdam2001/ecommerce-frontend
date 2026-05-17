'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import useCartStore from '@/store/cartStore';
import toast from 'react-hot-toast';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.product);
        if (res.data.product.category?._id) {
          const rel = await api.get(`/products?category=${res.data.product.category._id}&limit=5`);
          setRelated(rel.data.products.filter(p => p._id !== id));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addItem(product);
    toast.success(`${product.name} added to cart!`);
  };

  // ✅ Fixed: add to cart first, then navigate — no race condition
  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) addItem(product);
    router.push('/checkout');
  };

  const discount = product?.comparePrice > 0
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
      <p style={{ color: '#9ca3af' }}>Loading product...</p>
    </div>
  );

  if (!product) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '1rem', background: '#f9fafb' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😕</div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Product not found</h2>
      <Link href="/products" style={{ color: '#FF6B00', textDecoration: 'none' }}>Back to products</Link>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem' }}>

        {/* Breadcrumb */}
        <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '1rem', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: '#9ca3af', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link href="/products" style={{ color: '#9ca3af', textDecoration: 'none' }}>Products</Link>
          <span>/</span>
          <span style={{ color: '#374151' }}>{product.name}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>

          {/* Image gallery */}
          <div>
            <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #f3f4f6', marginBottom: '10px' }}>
              {product.images?.[selectedImage]?.url ? (
                <img
                  src={product.images[selectedImage].url}
                  alt={product.name}
                  style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ width: '100%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', background: '#f9fafb' }}>📦</div>
              )}
            </div>
            {product.images?.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', border: `2px solid ${selectedImage === i ? '#FF6B00' : '#e5e7eb'}`, flexShrink: 0, cursor: 'pointer', background: 'none', padding: 0 }}
                  >
                    <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div style={{ background: '#fff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #f3f4f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ background: '#fff7ed', color: '#FF6B00', fontSize: '12px', fontWeight: '500', padding: '4px 10px', borderRadius: '20px' }}>
                {product.category?.name || 'General'}
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(1.1rem, 4vw, 1.5rem)', fontWeight: '700', color: '#111827', marginBottom: '10px', lineHeight: 1.3 }}>
              {product.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              {[1, 2, 3, 4, 5].map(s => (
                <span key={s} style={{ fontSize: '14px', color: s <= Math.round(product.ratings || 4) ? '#FBBF24' : '#e5e7eb' }}>★</span>
              ))}
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>({product.numReviews || 0} reviews)</span>
              <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: '500' }}>{product.sold || 0} sold</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '12px' }}>
              <span style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: '800', color: '#FF6B00' }}>${product.price}</span>
              {product.comparePrice > 0 && (
                <>
                  <span style={{ fontSize: '1rem', color: '#9ca3af', textDecoration: 'line-through' }}>${product.comparePrice}</span>
                  <span style={{ background: '#ef4444', color: '#fff', fontSize: '12px', fontWeight: '700', padding: '2px 8px', borderRadius: '6px' }}>-{discount}%</span>
                </>
              )}
            </div>

            {product.stock > 0 && product.stock <= 10 && (
              <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '8px', padding: '8px 12px', marginBottom: '12px' }}>
                <p style={{ color: '#92400e', fontSize: '13px', margin: 0, fontWeight: '500' }}>Only {product.stock} items left!</p>
              </div>
            )}
            {product.stock === 0 && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '8px 12px', marginBottom: '12px' }}>
                <p style={{ color: '#991b1b', fontSize: '13px', margin: 0, fontWeight: '500' }}>Out of stock</p>
              </div>
            )}

            <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.6, marginBottom: '16px' }}>{product.description}</p>

            {/* Quantity selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{ width: '36px', height: '36px', background: '#fff', border: 'none', cursor: 'pointer', fontSize: '18px', fontWeight: '700', color: '#374151' }}
                >-</button>
                <span style={{ width: '36px', textAlign: 'center', fontWeight: '600', fontSize: '15px' }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock || 99, q + 1))}
                  style={{ width: '36px', height: '36px', background: '#fff', border: 'none', cursor: 'pointer', fontSize: '18px', fontWeight: '700', color: '#374151' }}
                >+</button>
              </div>
              <span style={{ fontSize: '13px', color: '#9ca3af' }}>{product.stock} available</span>
            </div>

            {/* ✅ Fixed: Buy Now is now a button using router.push, not a Link with onClick */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                style={{ flex: 1, background: product.stock === 0 ? '#9ca3af' : '#FF6B00', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: '700', cursor: product.stock === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                🛒 Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                style={{ flex: 1, background: product.stock === 0 ? '#9ca3af' : '#111827', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: '700', cursor: product.stock === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                Buy Now
              </button>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', paddingTop: '12px', borderTop: '1px solid #f3f4f6' }}>
              {[
                { icon: '🚚', label: 'Free Delivery' },
                { icon: '🔒', label: 'Secure Pay' },
                { icon: '↩️', label: '30 Day Return' }
              ].map((item, i) => (
                <div key={i} style={{ textAlign: 'center', padding: '8px' }}>
                  <div style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{item.icon}</div>
                  <p style={{ fontSize: '11px', color: '#6b7280', fontWeight: '500', margin: 0 }}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#111827', marginBottom: '1rem' }}>Related Products</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
              {related.slice(0, 5).map(p => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}