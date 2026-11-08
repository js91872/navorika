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
    <Link href={href} className="group inline-flex items-center gap-0 whitespace-nowrap" aria-label={ariaLabel}>
      <svg width={iconSize[size]} height={iconSize[size]} viewBox="0 0 125 90" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="shrink-0 transition-transform duration-300 group-hover:scale-105">
        <path fill="#e5322d" d="M12 68 30 17Q33 9 41 9H48Q53 9 57 14L82 43 88 23Q90 17 97 15L116 9Q121 7 119 14L102 69Q100 77 93 77H81Q75 77 71 71L49 41 43 59Q42 64 36 66L17 73Q10 75 12 68Z"/>
      </svg>
      <div className="flex flex-col">
        <span className={`font-black tracking-tight text-[var(--foreground)] transition-colors duration-300 ${textSize[size]}`}>avorika</span>
        {showTagline && <span className="text-[10px] font-bold text-[var(--muted-foreground)] tracking-[0.15em] uppercase leading-none">{tagline}</span>}
      </div>
    </Link>
  );
}
