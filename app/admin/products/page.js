'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', price: '',
    comparePrice: '', category: '', stock: '',
    isFeatured: false, imageUrl: ''
  });

  const fetchAll = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories')
      ]);
      setProducts(prodRes.data.products);
      setCategories(catRes.data.categories);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const productData = { ...form };
      if (form.imageUrl) {
        productData.images = [{ url: form.imageUrl, public_id: 'manual' }];
      }
      delete productData.imageUrl;
      await api.post('/products', productData);
      toast.success('Product created!');
      setForm({
        name: '', description: '', price: '',
        comparePrice: '', category: '', stock: '',
        isFeatured: false, imageUrl: ''
      });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted!');
      fetchAll();
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  const inputStyle = {
    width: '100%', border: '1px solid #e5e7eb', borderRadius: '8px',
    padding: '10px 14px', fontSize: '14px', color: '#111827',
    background: '#fff', boxSizing: 'border-box', outline: 'none'
  };
  const labelStyle = {
    display: 'block', fontSize: '14px', fontWeight: '500',
    color: '#374151', marginBottom: '6px'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#111827' }}>Manage Products</h1>
          <Link href="/admin" style={{ color: '#FF6B00', fontSize: '14px', textDecoration: 'none' }}>← Back to Dashboard</Link>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>Add New Product</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={labelStyle}>Product Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Wireless Headphones"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Price ($)</label>
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  required
                  placeholder="99.99"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Compare Price ($)</label>
                <input
                  name="comparePrice"
                  type="number"
                  value={form.comparePrice}
                  onChange={handleChange}
                  placeholder="149.99"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Stock</label>
                <input
                  name="stock"
                  type="number"
                  value={form.stock}
                  onChange={handleChange}
                  required
                  placeholder="50"
                  style={inputStyle}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '28px' }}>
                <input
                  type="checkbox"
                  name="isFeatured"
                  id="isFeatured"
                  checked={form.isFeatured}
                  onChange={handleChange}
                  style={{ width: '18px', height: '18px', accentColor: '#FF6B00' }}
                />
                <label htmlFor="isFeatured" style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  Featured Product
                </label>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Describe the product..."
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Product Image URL</label>
              <input
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/photo-xxx or any image link"
                style={inputStyle}
              />
              {form.imageUrl && (
                <img
                  src={form.imageUrl}
                  alt="preview"
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', marginTop: '8px', border: '1px solid #e5e7eb' }}
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}
              <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                Paste any image URL. Use links from the product list below.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ background: '#FF6B00', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Creating...' : 'Create Product'}
            </button>
          </form>
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>Quick Image URLs — copy and paste</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px', fontSize: '12px' }}>
            {[
              { name: 'Wireless Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
              { name: 'Smart Watch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' },
              { name: 'Bluetooth Speaker', url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400' },
              { name: 'iPhone Case', url: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=400' },
              { name: 'Laptop Stand', url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400' },
              { name: 'USB-C Hub', url: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400' },
              { name: 'White Sneakers', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
              { name: 'Leather Wallet', url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400' },
              { name: 'Sunglasses', url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400' },
              { name: 'Baseball Cap', url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400' },
              { name: 'Backpack', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400' },
              { name: 'Scented Candle', url: 'https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=400' },
              { name: 'Coffee Mug', url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400' },
              { name: 'Throw Pillow', url: 'https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?w=400' },
              { name: 'Mini Plant Pot', url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400' },
              { name: 'Wall Clock', url: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400' },
              { name: 'Face Moisturizer', url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400' },
              { name: 'Lip Gloss Set', url: 'https://images.unsplash.com/photo-1586495777744-4e6232bf2177?w=400' },
              { name: 'Perfume', url: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400' },
              { name: 'Facial Roller', url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                <img src={item.url} alt={item.name} style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />
                <div style={{ overflow: 'hidden', flex: 1 }}>
                  <p style={{ fontSize: '12px', fontWeight: '600', color: '#111827', margin: '0 0 2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setForm(prev => ({ ...prev, imageUrl: item.url }));
                      toast.success(`${item.name} image selected!`);
                    }}
                    style={{ fontSize: '11px', color: '#FF6B00', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: '600' }}
                  >
                    Use this image
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>All Products ({products.length})</h2>
          {products.length === 0 ? (
            <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem 0' }}>No products yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {products.map(product => (
                <div key={product._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: '#e5e7eb' }}>
                    {product.images?.[0]?.url
                      ? <img src={product.images[0].url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>📦</div>
                    }
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: '600', color: '#111827', margin: '0 0 2px 0' }}>{product.name}</p>
                    <p style={{ fontSize: '13px', color: '#FF6B00', fontWeight: '600', margin: '0 0 2px 0' }}>${product.price}</p>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Stock: {product.stock} | {product.category?.name}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(product._id)}
                    style={{ color: '#ef4444', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))'