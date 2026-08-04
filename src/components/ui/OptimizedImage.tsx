'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <Image
        src={src}
        alt={alt}
        width={width || 1200}
        height={height || 630}
        priority={priority}
        sizes={sizes}
        className={cn(
          'duration-700 ease-in-out',
          isLoading ? 'scale-110 blur-lg' : 'scale-100 blur-0'
        )}
        onLoad={() => setIsLoading(false)}
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  );
}
