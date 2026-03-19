'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/axios';
import useCartStore from '@/store/cartStore';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { FaStar } from 'react-icons/fa';
import { FiShoppingCart, FiHeart, FiShare2, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';
import ProductCard from '@/components/product/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams();
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

  const discount = product?.comparePrice > 0
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-400 text-xl">Loading product...</div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold mb-2">Product not found</h2>
        <Link href="/products" className="text-orange-500 hover:underline">Back to products</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">

        <div className="text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-orange-500">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-orange-500">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <div className="bg-white rounded-2xl overflow-hidden mb-3 border border-gray-100">
              {product.images?.[selectedImage]?.url ? (
                <img
                  src={product.images[selectedImage].url}
                  alt={product.name}
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div className="w-full h-96 flex items-center justify-center text-8xl bg-gray-50">📦</div>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition ${selectedImage === i ? 'border-orange-500' : 'border-gray-200'}`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <span className="bg-orange-50 text-orange-600 text-xs font-medium px-3 py-1 rounded-full">
                {product.category?.name || 'General'}
              </span>
              <div className="flex gap-2">
                <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">
                  <FiHeart size={16} className="text-gray-500" />
                </button>
                <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">
                  <FiShare2 size={16} className="text-gray-500" />
                </button>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <FaStar key={s} size={14} className={s <= Math.round(product.ratings || 4) ? 'text-yellow-400' : 'text-gray-200'} />
                ))}
              </div>
              <span className="text-sm text-gray-500">({product.numReviews || 0} reviews)</span>
              <span className="text-sm text-green-600 font-medium">{product.sold || 0} sold</span>
            </div>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-4xl font-bold" style={{ color: '#FF6B00' }}>${product.price}</span>
              {product.comparePrice > 0 && (
                <>
                  <span className="text-gray-400 line-through text-xl">${product.comparePrice}</span>
                  <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded-lg">-{discount}%</span>
                </>
              )}
            </div>

            {product.stock > 0 && product.stock <= 10 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-2 mb-4">
                <p className="text-orange-700 text-sm font-medium">Only {product.stock} items left in stock!</p>
              </div>
            )}
            {product.stock === 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 mb-4">
                <p className="text-red-700 text-sm font-medium">Out of stock</p>
              </div>
            )}

            <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-lg font-bold"
                >-</button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-lg font-bold"
                >+</button>
              </div>
              <span className="text-sm text-gray-500">{product.stock} available</span>
            </div>

            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 text-white py-3 rounded-xl font-bold text-lg hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: '#FF6B00' }}
              >
                <FiShoppingCart size={20} />
                Add to Cart
              </button>
              <Link
                href="/checkout"
                onClick={handleAddToCart}
                className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold text-lg hover:bg-gray-800 transition text-center"
              >
                Buy Now
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
              <div className="text-center">
                <FiTruck size={20} className="text-orange-500 mx-auto mb-1" />
                <p className="text-xs text-gray-600 font-medium">Free Delivery</p>
              </div>
              <div className="text-center">
                <FiShield size={20} className="text-orange-500 mx-auto mb-1" />
                <p className="text-xs text-gray-600 font-medium">Secure Payment</p>
              </div>
              <div className="text-center">
                <FiRefreshCw size={20} className="text-orange-500 mx-auto mb-1" />
                <p className="text-xs text-gray-600 font-medium">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
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