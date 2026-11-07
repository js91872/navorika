'use client';

import Link from 'next/link';

interface LogoProps {
  variant?: 'default' | 'light' | 'dark';
  showTagline?: boolean;
  tagline?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
  ariaLabel?: string;
}

export default function Logo({
  variant = 'default',
  showTagline = false,
  tagline = 'Free Tools · Privacy-First',
  size = 'md',
  href = '/',
  ariaLabel = 'Navorika home',
}: LogoProps) {
  const iconSize = { sm: 28, md: 36, lg: 48, xl: 64 };
  const textSize = { sm: 'text-lg', md: 'text-2xl', lg: 'text-3xl', xl: 'text-5xl' };
  return (
    <Link href={href} className="group flex items-center gap-1.5" aria-label={ariaLabel}>
      <span aria-hidden="true" className="inline-flex shrink-0 items-center justify-center font-black italic tracking-[-0.14em] text-[#e5322d] leading-none" style={{ width: iconSize[size], height: iconSize[size], fontSize: iconSize[size] * 1.15, paddingRight: 4 }}>N</span>     <div className="flex flex-col">
        <span className={`font-black tracking-tight text-[var(--foreground)] transition-colors duration-300 ${textSize[size]}`}>avorika</span>
        {showTagline && <span className="text-[10px] font-bold text-[var(--muted-foreground)] tracking-[0.15em] uppercase leading-none">{tagline}</span>}
      </div>
    </Link>
  );
}
