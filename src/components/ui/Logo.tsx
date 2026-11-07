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
      <svg width={iconSize[size]} height={iconSize[size]} viewBox="0 0 125 90" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="shrink-0 transition-transform duration-300 group-hover:scale-105">
        <path fill="#e5322d" d="M12 68 30 17Q33 9 41 9H48Q53 9 57 14L82 43 88 23Q90 17 97 15L116 9Q121 7 119 14L102 69Q100 77 93 77H81Q75 77 71 71L49 41 43 59Q42 64 36 66L17 73Q10 75 12 68Z"/>
        <path fill="#c71f1e" d="M30 27Q34 24 39 28L49 41 43 59Q42 64 36 66L17 73Z" opacity=".65"/>
        <path fill="#b91c1c" d="M49 41 71 71Q75 77 81 77H93Q97 77 100 72 94 75 89 71L49 30Z" opacity=".5"/>
        <path fill="#b91c1c" d="M82 43 88 23Q90 17 97 15L116 9 102 54Q99 59 95 59Q91 59 88 55Z" opacity=".34"/>
      </svg>
      <div className="flex flex-col">
        <span className={`font-black tracking-tight text-[var(--foreground)] transition-colors duration-300 ${textSize[size]}`}>avorika</span>
        {showTagline && <span className="text-[10px] font-bold text-[var(--muted-foreground)] tracking-[0.15em] uppercase leading-none">{tagline}</span>}
      </div>
    </Link>
  );
}
