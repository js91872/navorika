"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
              Fast, reliable and beautifully designed online tools for productivity, finance, PDFs, AI and more.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t('footer.product')}</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/tools" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">{t('nav.tools')}</Link></li>
              <li><Link href="/categories" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">{t('nav.categories')}</Link></li>
              <li><Link href="/guides" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">{t('nav.guides')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t('footer.company')}</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/about" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">{t('footer.about')}</Link></li>
              <li><Link href="/contact" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">{t('footer.contact')}</Link></li>
              <li><Link href="/privacy" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">{t('footer.privacy')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t('footer.resources')}</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/blog" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">{t('footer.blog')}</Link></li>
              <li><Link href="/help" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">{t('footer.help')}</Link></li>
              <li><Link href="/sitemap" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">{t('footer.sitemap')}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-200 pt-8 dark:border-slate-700">
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} Navorika. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
