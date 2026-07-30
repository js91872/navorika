import './globals.css';
import { ReactNode } from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Navorika | Professional Free Online Tools, Calculators & Utilities',
  description: 'Access 40+ high-performance calculators, PDF utilities, image tools, and developer aids designed for lightning-fast productivity.',
  keywords: 'online tools, calculators, pdf tools, image tools, developer utilities, productivity tools',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen flex flex-col selection:bg-indigo-500 selection:text-white">
        {/* Top Announcement / Navigation Bar */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                N
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight text-white">Navorika</span>
                <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-semibold">Pro Utilities</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <Link href="/#categories" className="hover:text-white transition-colors">Categories</Link>
              <Link href="/#tools" className="hover:text-white transition-colors">Tools Hub</Link>
              <Link href="/guides" className="hover:text-white transition-colors">Guides</Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link href="/#tools" className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 hover:shadow-indigo-500/30 transition-all">
                Explore Tools
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1">
          {children}
        </main>

        {/* High-End Footer */}
        <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 text-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              <div className="space-y-4 md:col-span-1">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-base">
                    N
                  </div>
                  <span className="font-bold text-lg text-white">Navorika</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Engineered for professionals, creators, and developers seeking lightning-fast client-side utilities.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">Categories</h4>
                <ul className="space-y-2.5 text-xs">
                  <li><Link href="/#categories" className="hover:text-white transition-colors">Finance Calculators</Link></li>
                  <li><Link href="/#categories" className="hover:text-white transition-colors">PDF Suite</Link></li>
                  <li><Link href="/#categories" className="hover:text-white transition-colors">Image Tools</Link></li>
                  <li><Link href="/#categories" className="hover:text-white transition-colors">Developer Utilities</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">Platform</h4>
                <ul className="space-y-2.5 text-xs">
                  <li><Link href="/#tools" className="hover:text-white transition-colors">All Tools Hub</Link></li>
                  <li><Link href="/guides" className="hover:text-white transition-colors">Documentation</Link></li>
                  <li><Link href="/about" className="hover:text-white transition-colors">About Navorika</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">Legal & Trust</h4>
                <ul className="space-y-2.5 text-xs">
                  <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-colors">Secure Contact</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs gap-4">
              <p>© {new Date().getFullYear()} Navorika Systems. Built for high performance.</p>
              <div className="flex items-center gap-6">
                <span className="inline-flex items-center gap-2 text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Client-Side Privacy Active
                </span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
