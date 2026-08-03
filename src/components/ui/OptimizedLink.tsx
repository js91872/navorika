'use client';

import Link from 'next/link';
import { prefetchLink } from '@/lib/performance';

interface OptimizedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  prefetch?: boolean;
  onClick?: () => void;
}

export function OptimizedLink({
  href,
  children,
  className,
  prefetch = true,
  onClick,
}: OptimizedLinkProps) {
  const handleMouseEnter = () => {
    if (prefetch) {
      prefetchLink(href);
    }
  };

  return (
    <Link
      href={href}
      className={className}
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
