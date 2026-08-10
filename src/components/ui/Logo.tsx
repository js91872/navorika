'use client';

import Link from 'next/link';

interface LogoProps {
  variant?: 'default' | 'footer';
  showTagline?: boolean;
  className?: string;
}

export default function Logo({ variant = 'default', showTagline = false, className = '' }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 group ${className}`}>
      {/* Logo Icon */}
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-indigo-500/25 transition-shadow">
          N
        </div>
      </div>
      
      {/* Logo Text */}
      <div className="flex flex-col">
        <div className="flex items-center gap-0.5">
          <span className="font-black tracking-tight text-[var(--foreground)] transition-colors duration-300 text-xl">
            Navorika
          </span>
        </div>
        {showTagline && (
          <span className="text-[9px] font-bold text-[var(--muted-foreground)] tracking-[0.15em] uppercase leading-none">
            100+ Free Tools · Client-Side
          </span>
        )}
      </div>
    </Link>
  );
}
