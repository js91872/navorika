'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'small' | 'default' | 'large';
  showTagline?: boolean;
  iconOnly?: boolean;
}

export default function Logo({ 
  className, 
  variant = 'default', 
  showTagline = false,
  iconOnly = false 
}: LogoProps) {
  const sizes = {
    small: 'h-8 w-8',
    default: 'h-10 w-10',
    large: 'h-14 w-14',
  };

  const textSizes = {
    small: 'text-base',
    default: 'text-xl',
    large: 'text-3xl',
  };

  const iconSize = sizes[variant] || sizes.default;
  const textSize = textSizes[variant] || textSizes.default;

  return (
    <Link href="/" className={cn('flex items-center gap-2 group', className)}>
      {/* Logo Icon - Animated SVG */}
      <div className="relative">
        <div className={cn(
          'relative transition-all duration-500 group-hover:scale-105',
          iconSize
        )}>
          <svg
            className="w-full h-full"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1"/>
                <stop offset="50%" stopColor="#8b5cf6"/>
                <stop offset="100%" stopColor="#a855f7"/>
              </linearGradient>
              <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
              </radialGradient>
            </defs>
            
            {/* Glow */}
            <circle cx="24" cy="24" r="22" fill="url(#glowGrad)" className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
            
            {/* Hexagon background */}
            <polygon 
              points="24,6 40,14 40,30 24,38 8,30 8,14" 
              fill="url(#logoGrad)" 
              stroke="white" 
              strokeWidth="2"
              className="transition-all duration-300 group-hover:shadow-lg"
            />
            
            {/* N shape */}
            <polygon points="24,14 32,20 24,26 16,20" fill="white" opacity="0.9"/>
            <polygon points="24,26 32,32 24,38 16,32" fill="white" opacity="0.4"/>
            
            {/* Decorative dots */}
            <circle cx="16" cy="14" r="1.5" fill="white" opacity="0.6"/>
            <circle cx="32" cy="14" r="1.5" fill="white" opacity="0.6"/>
            <circle cx="16" cy="34" r="1.5" fill="white" opacity="0.6"/>
            <circle cx="32" cy="34" r="1.5" fill="white" opacity="0.6"/>
          </svg>
        </div>
        
        {/* Pulse ring animation */}
        <div className={cn(
          'absolute inset-0 rounded-full border-2 border-indigo-500/20 opacity-0 group-hover:opacity-100',
          'animate-ping duration-1000',
          iconSize
        )} />
      </div>

      {/* Logo Text */}
      {!iconOnly && (
        <div className="flex flex-col">
          <div className="flex items-center gap-0.5">
            <span className={cn(
              'font-black tracking-tight text-[var(--foreground)] transition-colors duration-300',
              textSize
            )}>
              Navorika
            </span>
            <span className={cn(
              'font-black tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent',
              textSize
            )}>
              Pro
            </span>
          </div>
          {showTagline && (
            <span className="text-[9px] font-bold text-[var(--muted-foreground)] tracking-[0.15em] uppercase leading-none">
              100+ Free Tools · Client-Side
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
