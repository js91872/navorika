'use client';

import { cn } from '@/lib/utils';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'rainbow';
}

const variants = {
  primary: 'from-indigo-400 via-purple-400 to-indigo-400',
  secondary: 'from-purple-400 via-pink-400 to-rose-400',
  accent: 'from-emerald-400 via-teal-400 to-cyan-400',
  rainbow: 'from-indigo-400 via-purple-400 via-pink-400 via-rose-400 to-amber-400',
};

export function GradientText({ children, className, variant = 'primary' }: GradientTextProps) {
  return (
    <span className={cn(
      'bg-gradient-to-r bg-clip-text text-transparent',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
