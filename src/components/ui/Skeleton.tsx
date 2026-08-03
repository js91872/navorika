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
        'animate-pulse bg-white/10',
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
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex items-start justify-between mb-4">
        <Skeleton variant="circle" width={40} height={40} />
        <Skeleton width={60} height={20} />
      </div>
      <Skeleton width="70%" height={24} className="mb-2" />
      <Skeleton width="90%" height={16} className="mb-2" />
      <Skeleton width="60%" height={16} />
      <div className="mt-4 pt-4 border-t border-white/5">
        <Skeleton width="40%" height={14} />
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-3xl">
        <Skeleton width={200} height={30} className="mx-auto mb-6" />
        <Skeleton width="80%" height={72} className="mx-auto mb-4" />
        <Skeleton width="90%" height={24} className="mx-auto mb-8" />
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <Skeleton className="flex-1" height={52} />
          <Skeleton width={100} height={52} />
        </div>
      </div>
    </div>
  );
}
