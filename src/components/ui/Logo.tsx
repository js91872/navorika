'use client';

import { useId } from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'default' | 'light' | 'dark';
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Logo({
  variant = 'default',
  showTagline = false,
  size = 'md',
}: LogoProps) {
  const rawId = useId();
  const uid = rawId.replace(/:/g, '');

  const gradientId = `navorika-gradient-${uid}`;
  const stemGradientId = `navorika-stem-${uid}`;
  const maskId = `navorika-cut-${uid}`;

  const iconSize = {
    sm: 28,
    md: 36,
    lg: 48,
    xl: 64,
  };

  const textSize = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-5xl',
  };

  const iconSizeNum = iconSize[size];

  return (
    <Link
      href="/"
      className="group flex items-center gap-3"
      aria-label="Navorika home"
    >
      <svg
        width={iconSizeNum}
        height={iconSizeNum}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0 overflow-visible drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          {/* Main Navorika portal gradient */}
          <linearGradient
            id={gradientId}
            x1="9"
            y1="8"
            x2="55"
            y2="56"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#4F46FF" />
            <stop offset="28%" stopColor="#7C3AED" />
            <stop offset="55%" stopColor="#A855F7" />
            <stop offset="78%" stopColor="#D946EF" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>

          {/* Slightly deeper side-stroke gradient */}
          <linearGradient
            id={stemGradientId}
            x1="8"
            y1="14"
            x2="54"
            y2="52"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#4338CA" />
            <stop offset="42%" stopColor="#7C3AED" />
            <stop offset="75%" stopColor="#C026D3" />
            <stop offset="100%" stopColor="#DB2777" />
          </linearGradient>

          {/*
            Cut a narrow transparent channel behind the ribbon.
            This creates the distinctive negative-space separation
            visible in concept #6.
          */}
          <mask id={maskId}>
            <rect width="64" height="64" fill="white" />

            <path
              d="M14 11L50 53"
              stroke="black"
              strokeWidth="16"
              strokeLinecap="round"
            />
          </mask>
        </defs>

        {/* Side pillars */}
        <g mask={`url(#${maskId})`}>
          {/* Left lower pillar */}
          <path
            d="M10 20L25 35V50C25 56.1 21.1 60 16 60C10.9 60 8 56.1 8 51V22C8 20.9 8.9 20 10 20Z"
            fill={`url(#${stemGradientId})`}
          />

          {/* Right upper pillar */}
          <path
            d="M47 4C52 4 56 8 56 13V46L41 30V13C41 8 43 4 47 4Z"
            fill={`url(#${stemGradientId})`}
          />
        </g>

        {/* Main flowing diagonal ribbon */}
        <path
          d="M15 11L49 53"
          stroke={`url(#${gradientId})`}
          strokeWidth="13"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Subtle ribbon highlight */}
        <path
          d="M15.5 10.5L49.5 52.5"
          stroke="white"
          strokeOpacity="0.10"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      <div className="flex flex-col">
        <span
          className={`font-black tracking-tight text-[var(--foreground)] transition-colors duration-300 ${textSize[size]}`}
        >
          Navorika
        </span>

        {showTagline && (
          <span className="text-[10px] font-bold text-[var(--muted-foreground)] tracking-[0.15em] uppercase leading-none">
            Free Tools · Privacy-First
          </span>
        )}
      </div>
    </Link>
  );
}
