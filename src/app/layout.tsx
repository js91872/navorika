import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import ThemeToggle from '@/components/header/ThemeToggle';
import Link from 'next/link';
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
          
          {/* Master Application Header */}
          <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-indigo-600 dark:text-indigo-400">Navorika</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">Pro</span>
              </Link>
              
              <div className="flex items-center gap-4">
                <nav className="hidden sm:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Home</Link>
                  <Link href="/#categories" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Categories</Link>
                </nav>
                <ThemeToggle />
              </div>
            </div>
          </header>

          {/* Main Content Payload */}
          <main className="flex-grow">
            {children}
          </main>

          {/* Master Footer */}
          <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 dark:text-slate-400">
              © 2026 Navorika Systems. Engineered for professional client-side performance.
            </div>
          </footer>
          
        </ThemeProvider>
      </body>
    </html>
  );
}