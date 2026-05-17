'use client';
import Link from 'next/link';
import { FiShoppingCart, FiMenu, FiX, FiChevronDown, FiPackage, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // FIX: hydration guard
  const { getTotalItems } = useCartStore();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const adminRef = useRef(null);
  const userRef = useRef(null);

  const isAdmin = user && user.role === 'admin';

  // FIX: only render cart count after client mount to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (adminRef.current && !adminRef.current.contains(e.target)) setAdminOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    router.push('/');
    setUserOpen(false);
    setMenuOpen(false);
  };

  const adminLinks = [
    { href: '/admin',            label: 'Dashboard'  },
    { href: '/admin/orders',     label: 'Orders'     },
    { href: '/admin/products',   label: 'Products'   },
    { href: '/admin/categories', label: 'Categories' },
    { href: '/admin/users',      label: 'Users'      },
  ];

  return (
    <nav style={{ background: '#fff', borderBottom: '1px solid #f3f4f6', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>

        <Link href="/" style={{ fontSize: '1.5rem', fontWeight: '800', color: '#FF6B00', textDecoration: 'none' }}>
          ShopZone
        </Link>

        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <Link href="/" style={{ color: '#374151', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}
            onMouseEnter={e => e.target.style.color = '#FF6B00'}
            onMouseLeave={e => e.target.style.color = '#374151'}
          >Home</Link>
          <Link href="/products" style={{ color: '#374151', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}
            onMouseEnter={e => e.target.style.color = '#FF6B00'}
            onMouseLeave={e => e.target.style.color = '#374151'}
          >Products</Link>

          {isAdmin === true && (
            <div ref={adminRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setAdminOpen(!adminOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#374151', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '500', padding: 0 }}
              >
                <FiSettings size={14} />
                Admin
                <FiChevronDown size={14} style={{ transform: adminOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
              </button>
              {adminOpen && (
                <div style={{ position: 'absolute', top: '40px', left: 0, background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', padding: '8px', width: '180px', zIndex: 100 }}>
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid #f3f4f6', marginBottom: '4px' }}>
                    <p style={{ fontSize: '11px', fontWeight: '700', color: '#FF6B00', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin Panel</p>
                  </div>
                  {adminLinks.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setAdminOpen(false)}
                      style={{ display: 'block', padding: '9px 12px', fontSize: '14px', color: '#374151', textDecoration: 'none', borderRadius: '8px', transition: 'background 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#fff7ed'; e.currentTarget.style.color = '#FF6B00'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#374151'; }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

          {/* FIX: wrap badge in mounted check — prevents server/client HTML mismatch */}
          <Link href="/cart" style={{ position: 'relative', color: '#374151', textDecoration: 'none' }}>
            <FiShoppingCart size={22} />
            {mounted && getTotalItems() > 0 && (
              <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#FF6B00', color: '#fff', fontSize: '10px', fontWeight: '700', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {getTotalItems()}
              </span>
            )}
          </Link>

          {user ? (
            <div ref={userRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setUserOpen(!userOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '20px', padding: '6px 12px', cursor: 'pointer' }}
              >
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#FF6B00', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: '700', flexShrink: 0 }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '13px', fontWeight: '500', color: '#374151', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name?.split(' ')[0]}
                </span>
                <FiChevronDown size={12} color="#374151" style={{ transform: userOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
              </button>

              {userOpen && (
                <div style={{ position: 'absolute', top: '48px', right: 0, background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', padding: '8px', width: '200px', zIndex: 100 }}>
                  <div style={{ padding: '10px 12px', borderBottom: '1px solid #f3f4f6', marginBottom: '4px' }}>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: '0 0 2px 0' }}>{user.name}</p>
                    <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0 0 4px 0', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</p>
                    <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: '600', background: isAdmin ? '#fff7ed' : '#f0fdf4', color: isAdmin ? '#FF6B00' : '#16a34a' }}>
                      {isAdmin ? 'Admin' : 'Customer'}
                    </span>
                  </div>

                  <Link href="/orders" onClick={() => setUserOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', fontSize: '14px', color: '#374151', textDecoration: 'none', borderRadius: '8px' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#f9fafb'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <FiPackage size={15} color="#6b7280" /> My Orders
                  </Link>

                  {isAdmin === true && (
                    <Link href="/admin" onClick={() => setUserOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', fontSize: '14px', color: '#FF6B00', textDecoration: 'none', borderRadius: '8px', fontWeight: '500' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#fff7ed'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <FiSettings size={15} color="#FF6B00" /> Admin Dashboard
                    </Link>
                  )}

                  <div style={{ borderTop: '1px solid #f3f4f6', marginTop: '4px', paddingTop: '4px' }}>
                    <button
                      onClick={handleLogout}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '9px 12px', fontSize: '14px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '8px', textAlign: 'left' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <FiLogOut size={15} color="#ef4444" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="desktop-nav" style={{ display: 'flex', gap: '8px' }}>
              <Link href="/auth/login" style={{ color: '#374151', border: '1px solid #e5e7eb', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
                Login
              </Link>
              <Link href="/auth/register" style={{ background: '#FF6B00', color: '#fff', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
                Register
              </Link>
            </div>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'none' }}
            className="mobile-menu-btn"
          >
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: '#fff', borderTop: '1px solid #f3f4f6', padding: '1rem' }}>
          <Link href="/" style={{ display: 'block', padding: '12px 0', color: '#374151', textDecoration: 'none', fontSize: '15px', borderBottom: '1px solid #f9fafb' }} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/products" style={{ display: 'block', padding: '12px 0', color: '#374151', textDecoration: 'none', fontSize: '15px', borderBottom: '1px solid #f9fafb' }} onClick={() => setMenuOpen(false)}>Products</Link>
          <Link href="/cart" style={{ display: 'block', padding: '12px 0', color: '#374151', textDecoration: 'none', fontSize: '15px', borderBottom: '1px solid #f9fafb' }} onClick={() => setMenuOpen(false)}>
            Cart {mounted && getTotalItems() > 0 && `(${getTotalItems()})`}
          </Link>
          {user && (
            <Link href="/orders" style={{ display: 'block', padding: '12px 0', color: '#374151', textDecoration: 'none', fontSize: '15px', borderBottom: '1px solid #f9fafb' }} onClick={() => setMenuOpen(false)}>My Orders</Link>
          )}
          {isAdmin === true && (
            <>
              <div style={{ padding: '12px 0 4px', fontSize: '11px', fontWeight: '700', color: '#FF6B00', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin</div>
              {adminLinks.map(item => (
                <Link key={item.href} href={item.href} style={{ display: 'block', padding: '10px 0 10px 12px', color: '#374151', textDecoration: 'none', fontSize: '14px', borderBottom: '1px solid #f9fafb' }} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </Link>
              ))}
            </>
          )}
          {!user && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <Link href="/auth/login" style={{ flex: 1, textAlign: 'center', border: '1px solid #e5e7eb', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', color: '#374151' }} onClick={() => setMenuOpen(false)}>Login</Link>
              <Link href="/auth/register" style={{ flex: 1, textAlign: 'center', background: '#FF6B00', color: '#fff', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }} onClick={() => setMenuOpen(false)}>Register</Link>
            </div>
          )}
          {user && (
            <button onClick={handleLogout} style={{ width: '100%', marginTop: '8px', padding: '10px', background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}