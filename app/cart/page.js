'use client';
import useCartStore from '@/store/cartStore';
import Link from 'next/link';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some products to get started</p>
        <Link
          href="/products"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Your Cart</h1>
        <button
          onClick={clearCart}
          className="text-red-500 hover:text-red-700 text-sm font-medium"
        >
          Clear Cart
        </button>
      </div>

      <div className="space-y-4 mb-8">
        {items.map(item => (
          <div key={item._id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              {item.images?.[0]?.url ? (
                <img src={item.images[0].url} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{item.name}</h3>
              <p className="text-blue-600 font-bold">${item.price}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
              >
                <FiMinus size={14} />
              </button>
              <span className="w-8 text-center font-semibold">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
              >
                <FiPlus size={14} />
              </button>
            </div>

            <p className="font-bold text-gray-800 w-20 text-right">
              ${(item.price * item.quantity).toFixed(2)}
            </p>

            <button
              onClick={() => removeItem(item._id)}
              className="text-red-500 hover:text-red-700 ml-2"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold">${getTotalPrice().toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Shipping</span>
          <span className="text-green-600 font-semibold">Free</span>
        </div>
        <div className="border-t pt-4 flex justify-between items-center mb-6">
          <span className="text-xl font-bold">Total</span>
          <span className="text-xl font-bold text-blue-600">${getTotalPrice().toFixed(2)}</span>
        </div>
        <Link
          href="/checkout"
          className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 font-semibold text-lg"
        >
          Proceed to Checkout
        </Link>
        <Link
          href="/products"
          className="block w-full text-center text-gray-500 hover:text-gray-700 mt-3 text-sm"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}