'use client';

import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  variant?: 'default' | 'light' | 'dark';
  showTagline?: boolean;
  tagline?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
  ariaLabel?: string;
}

/**
 * Approved Navorika identity: bright-red ribbon N + charcoal wordmark.
 * Keep the header logo and favicon in sync with public/logo.svg and public/favicon.svg.
 */
export default function Logo({
  size = 'md',
  href = '/',
  ariaLabel = 'Navorika home',
}: LogoProps) {
  const dimensions = {
    sm: { width: 150, height: 32 },
    md: { width: 190, height: 40 },
    lg: { width: 228, height: 48 },
    xl: { width: 285, height: 60 },
  }[size];

  return (
    <Link href={href} className="group inline-flex shrink-0 items-center" aria-label={ariaLabel}>
      <Image
        src="/logo.svg"
        alt=""
        aria-hidden="true"
        width={dimensions.width}
        height={dimensions.height}
        unoptimized
        priority
        className="block h-auto max-w-full"
      />
    </Link>
  );
}
