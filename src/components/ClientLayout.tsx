'use client';

import { useState } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/footer/Footer';
import SearchOverlay from '@/components/SearchOverlay';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <ThemeProvider>
      <Navbar onSearchClick={() => setSearchOpen(true)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </ThemeProvider>
  );
}
