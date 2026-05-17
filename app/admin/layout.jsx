'use client';
import AdminGuard from '@/components/AdminGuard';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import { useRouter } from 'next/navigation';

const navLinks = [
  { href: '/admin/dashboard', label: '📊 Dashboard' },
  { href: '/admin/products',  label: '📦 Products'  },
  { href: '/admin/orders',    label: '🧾 Orders'    },
  { href: '/admin/users',     label: '👥 Users'     },
  { href: '/admin/categories',label: '🗂 Categories' },
];

function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  return (
    <aside style={{
      width: '220px',
      minHeight: '100vh',
      background: '#111827',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 0',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '0 1.25rem 1.5rem', borderBottom: '1px solid #1f2937' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FF6B00', margin: 0 }}>ShopZone</h1>
        <p style={{ fontSize: '11px', color: '#6b7280', margin: '4px 0 0' }}>Admin Panel</p>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '1rem 0' }}>
        {navLinks.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'block',
                padding: '10px 1.25rem',
                fontSize: '14px',
                fontWeight: active ? '600' : '400',
                color: active ? '#FF6B00' : '#9ca3af',
                textDecoration: 'none',
                background: active ? '#1f2937' : 'transparent',
                borderLeft: active ? '3px solid #FF6B00' : '3px solid transparent',
                transition: 'all 0.15s ease',
              }}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #1f2937' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            background: '#1f2937',
            color: '#ef4444',
            border: '1px solid #374151',
            borderRadius: '8px',
            padding: '10px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
          }}
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}

export default function AdminLayout({ children }) {
  return (
    <AdminGuard>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
        <AdminSidebar />
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}