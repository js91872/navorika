'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'default' | 'small' | 'large';
  showTagline?: boolean;
}

export default function Logo({ className, variant = 'default', showTagline = false }: LogoProps) {
  const sizes = {
    small: 'text-lg',
    default: 'text-xl',
    large: 'text-3xl',
  };

  const iconSizes = {
    small: 'h-5 w-5',
    default: 'h-6 w-6',
    large: 'h-8 w-8',
  };

  return (
    <Link href="/" className={cn('flex items-center gap-2 group', className)}>
      {/* Logo Icon */}
      <div className="relative">
        <div className={cn(
          'rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5',
          'shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300'
        )}>
          <svg
            className={cn('text-white', iconSizes[variant])}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        {/* Glow effect */}
        <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Logo Text */}
      <div className="flex flex-col">
        <span className={cn(
          'font-black tracking-tight text-[var(--foreground)] transition-colors duration-300',
          sizes[variant]
        )}>
          Navorika<span className="text-indigo-600 dark:text-indigo-400">Pro</span>
        </span>
        {showTagline && (
          <span className="text-[10px] font-medium text-[var(--muted-foreground)] tracking-wider uppercase">
            200+ Free Tools
          </span>
        )}
      </div>
    </Link>
  );
}
