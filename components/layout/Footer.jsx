export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold text-blue-400 mb-3">ShopZone</h3>
          <p className="text-gray-400 text-sm">Best products at the best prices. Shop with confidence.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/products" className="hover:text-white">Products</a></li>
            <li><a href="/cart" className="hover:text-white">Cart</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Contact</h4>
          <p className="text-gray-400 text-sm">support@shopzone.com</p>
        </div>
      </div>
      <div className="text-center text-gray-500 text-sm py-4 border-t border-gray-800">
        © 2024 ShopZone. All rights reserved.
      </div>
    </footer>
  );
}