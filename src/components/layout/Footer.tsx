"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 max-w-7xl py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <span>© {new Date().getFullYear()} Navorika</span>
            <span className="hidden md:inline">•</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="h-3 w-3 text-red-500" /> by the Navorika team
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/privacy" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition">
              Privacy
            </Link>
            <Link href="/contact" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition">
              Contact
            </Link>
            <Link href="/about" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition">
              About
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
