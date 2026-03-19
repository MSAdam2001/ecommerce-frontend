import { Geist } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const geist = Geist({ subsets: ['latin'] });

export const metadata = {
  title: 'ShopZone - Online Store',
  description: 'Best products at best prices',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <Toaster position="top-right" />
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <a  href="https://wa.me/23470694192"
          target="_blank"
          rel="noopener noreferrer"
          style={{ position: 'fixed', bottom: '24px', right: '24px', background: '#25D366', color: '#fff', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', zIndex: 999, textDecoration: 'none', boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)' }}
        >
          💬

        </a>
      </body>
    </html>
  );
}
