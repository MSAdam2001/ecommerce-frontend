'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import ProductCard from '@/components/product/ProductCard';
import { FiSearch, FiGrid, FiList } from 'react-icons/fi';
import { useSearchParams } from 'next/navigation';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sort, setSort] = useState('newest');
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const searchParams = useSearchParams();

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sort]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (selectedCategory) params.category = selectedCategory;
      if (sort) params.sort = sort;
      const res = await api.get('/products', { params });
      setProducts(res.data.products);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.categories);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const skeletons = [...Array(10)].map((_, i) => (
    <div key={i} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #f3f4f6', overflow: 'hidden' }}>
      <div style={{ height: '180px', background: '#f3f4f6' }}></div>
      <div style={{ padding: '12px' }}>
        <div style={{ height: '12px', background: '#f3f4f6', borderRadius: '6px', marginBottom: '8px', width: '80%' }}></div>
        <div style={{ height: '12px', background: '#f3f4f6', borderRadius: '6px', width: '50%' }}></div>
      </div>
    </div>
  ));

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #f3f4f6', padding: '12px 0', position: 'sticky', top: '64px', zIndex: 40 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
                <FiSearch size={16} />
              </span>
              <input
                type="text"
                placeholder="Search products, brands and more..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', paddingLeft: '38px', paddingRight: '16px', paddingTop: '10px', paddingBottom: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', color: '#111827', background: '#fff', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>
            <button type="submit" style={{ background: '#FF6B00', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Search
            </button>
          </form>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem' }}>
        <div style={{ overflowX: 'auto', paddingBottom: '8px', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '8px', minWidth: 'max-content' }}>
            <button
              onClick={() => setSelectedCategory('')}
              style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '500', border: '1px solid', cursor: 'pointer', whiteSpace: 'nowrap', background: selectedCategory === '' ? '#FF6B00' : '#fff', color: selectedCategory === '' ? '#fff' : '#374151', borderColor: selectedCategory === '' ? '#FF6B00' : '#e5e7eb' }}
            >
              All Products
            </button>
            {categories.map(cat => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '500', border: '1px solid', cursor: 'pointer', whiteSpace: 'nowrap', background: selectedCategory === cat._id ? '#FF6B00' : '#fff', color: selectedCategory === cat._id ? '#fff' : '#374151', borderColor: selectedCategory === cat._id ? '#FF6B00' : '#e5e7eb' }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
            <span style={{ fontWeight: '600', color: '#111827' }}>{total}</span> products found
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', color: '#374151', background: '#fff', outline: 'none', cursor: 'pointer' }}
            >
              <option value="newest">Newest first</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
            <button onClick={() => setViewMode('grid')} style={{ padding: '8px', border: '1px solid', borderRadius: '8px', cursor: 'pointer', background: viewMode === 'grid' ? '#FF6B00' : '#fff', color: viewMode === 'grid' ? '#fff' : '#374151', borderColor: viewMode === 'grid' ? '#FF6B00' : '#e5e7eb' }}>
              <FiGrid size={16} />
            </button>
            <button onClick={() => setViewMode('list')} style={{ padding: '8px', border: '1px solid', borderRadius: '8px', cursor: 'pointer', background: viewMode === 'list' ? '#FF6B00' : '#fff', color: viewMode === 'list' ? '#fff' : '#374151', borderColor: viewMode === 'list' ? '#FF6B00' : '#e5e7eb' }}>
              <FiList size={16} />
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
            {skeletons}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😕</div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>No products found</h2>
            <p style={{ color: '#6b7280' }}>Try a different search or category</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {products.map(product => (
              <div key={product._id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #f3f4f6', padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, background: '#f9fafb' }}>
                  {product.images?.[0]?.url
                    ? <img src={product.images[0].url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>📦</div>
                  }
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: '600', color: '#111827', marginBottom: '4px', fontSize: '15px' }}>{product.name}</p>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px', lineHeight: 1.4 }}>{product.description?.slice(0, 80)}...</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '8px' }}>
                    {[1,2,3,4,5].map(s => (
                      <span key={s} style={{ fontSize: '12px', color: s <= 4 ? '#FBBF24' : '#e5e7eb' }}>★</span>
                    ))}
                    <span style={{ fontSize: '12px', color: '#9ca3af', marginLeft: '4px' }}>({product.numReviews || 0})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#FF6B00' }}>${product.price}</span>
                    {product.comparePrice > 0 && (
                      <span style={{ fontSize: '13px', color: '#9ca3af', textDecoration: 'line-through' }}>${product.comparePrice}</span>
                    )}
                    {product.comparePrice > 0 && (
                      <span style={{ fontSize: '12px', background: '#fef2f2', color: '#ef4444', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>
                        -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}