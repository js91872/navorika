import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-6">
          
          {/* Branding & Copyright */}
          <div className="text-xs text-slate-500 dark:text-slate-400 text-center md:text-left">
            © {currentYear} Navorika Systems. Engineered for professional client-side performance.
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-400">
            <Link href="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Privacy
            </Link>
            <Link href="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Contact
            </Link>
            <Link href="/sitemap" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Sitemap
            </Link>
          </nav>
          
        </div>
      </div>
    </footer>
  );
}
