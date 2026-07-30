import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import Navbar from '@/components/header/Navbar';
import './globals.css';

export const metadata = {
  title: 'Navorika Pro Utilities | Client-Side Calculator & PDF Suite',
  description: 'Enterprise-grade browser utilities for finance, business, and document processing.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen flex flex-col transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          
          {/* Master Application Navigation */}
          <Navbar />

          {/* Main Content Payload - pt-20 prevents content from hiding behind fixed navbar */}
          <main className="flex-grow pt-20">
            {children}
          </main>

          {/* Master Footer */}
          <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 mt-16 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 dark:text-slate-400">
              © 2026 Navorika Systems. Engineered for professional client-side performance.
            </div>
          </footer>
          
        </ThemeProvider>
      </body>
    </html>
  );
}
