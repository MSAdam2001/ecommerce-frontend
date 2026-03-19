export default function Footer() {
  return (
    <footer style={{ background: '#111827', color: '#fff', marginTop: '2rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FF6B00', marginBottom: '0.75rem' }}>ShopZone</h3>
          <p style={{ color: '#9ca3af', fontSize: '13px', lineHeight: 1.6 }}>Best products at the best prices. Shop with confidence.</p>
        </div>
        <div>
          <h4 style={{ fontWeight: '600', marginBottom: '0.75rem', fontSize: '14px' }}>Quick Links</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[['/', 'Home'], ['/products', 'Products'], ['/cart', 'Cart'], ['/orders', 'My Orders']].map(([href, label]) => (
              <a key={href} href={href} style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '13px' }}>{label}</a>
            ))}
          </div>
        </div>
        <div>
          <h4 style={{ fontWeight: '600', marginBottom: '0.75rem', fontSize: '14px' }}>Contact</h4>
          <p style={{ color: '#9ca3af', fontSize: '13px' }}>support@shopzone.com</p>
          <p style={{ color: '#9ca3af', fontSize: '13px', marginTop: '4px' }}>Available 24/7</p>
        </div>
      </div>
      <div style={{ borderTop: '1px solid #1f2937', padding: '1rem', textAlign: 'center', fontSize: '12px', color: '#6b7280' }}>
        © 2024 ShopZone. All rights reserved.
        <a href="/admin/login" style={{ color: '#374151', textDecoration: 'none', marginLeft: '16px' }}>Admin</a>
      </div>
    </footer>
  );
}