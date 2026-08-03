'use client';

import { cn } from '@/lib/utils';

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient' | 'dark';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variants = {
  default: 'bg-white/5 border border-white/10',
  glass: 'bg-white/5 backdrop-blur-xl border border-white/10',
  gradient: 'bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-white/10',
  dark: 'bg-black/40 border border-white/5',
};

const paddings = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function PremiumCard({
  children,
  className,
  variant = 'default',
  hover = false,
  padding = 'md',
}: PremiumCardProps) {
  return (
    <div className={cn(
      'rounded-2xl transition-all duration-300',
      variants[variant],
      paddings[padding],
      hover && 'hover:border-white/20 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1',
      className
    )}>
      {children}
    </div>
  );
}
