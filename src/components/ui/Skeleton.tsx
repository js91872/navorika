'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circle' | 'rect' | 'card';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className,
  variant = 'text',
  width,
  height,
}: SkeletonProps) {
  const variants = {
    text: 'rounded',
    circle: 'rounded-full',
    rect: 'rounded-lg',
    card: 'rounded-2xl',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-[var(--muted)]',
        variants[variant],
        className
      )}
      style={{
        width: width || 'auto',
        height: height || (variant === 'text' ? '1em' : 'auto'),
        minHeight: variant === 'text' ? '1.2em' : undefined,
      }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
      <div className="flex items-start justify-between mb-4">
        <Skeleton variant="circle" width={40} height={40} />
        <Skeleton width={60} height={20} />
      </div>
      <Skeleton width="70%" height={24} className="mb-2" />
      <Skeleton width="90%" height={16} className="mb-2" />
      <Skeleton width="60%" height={16} />
      <div className="mt-4 pt-4 border-t border-[var(--border)]">
        <Skeleton width="40%" height={14} />
      </div>
    </div>
  );
}
