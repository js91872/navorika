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
 * Navorika identity: bright-red ribbon N with subtle fold depth + black "avorika" wordmark.
 * The logo has no separator or tagline; the favicon uses the same red N symbol.
 */
export default function Logo({
  size = 'md',
  href = '/',
  ariaLabel = 'Navorika home',
}: LogoProps) {
  const dimensions = {
    sm: { width: 150, height: 36 },
    md: { width: 190, height: 46 },
    lg: { width: 228, height: 55 },
    xl: { width: 285, height: 68 },
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
        className={size === 'md' ? 'block h-auto max-w-full w-[120px] min-[360px]:w-[145px] min-[390px]:w-[170px] sm:w-[190px]' : 'block h-auto max-w-full'}
      />
    </Link>
  );
}
