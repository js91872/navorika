'use client';

import Link from 'next/link';

interface LogoProps {
  variant?: 'default' | 'light' | 'dark';
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Logo({ variant = 'default', showTagline = false, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-base',
    md: 'h-10 w-10 text-xl',
    lg: 'h-14 w-14 text-2xl',
    xl: 'h-20 w-20 text-4xl'
  };

  const iconSize = {
    sm: 28,
    md: 36,
    lg: 48,
    xl: 64
  };

  const textSize = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-5xl'
  };

  const iconSizeNum = iconSize[size];
  const textSizeClass = textSize[size];

  return (
    <Link href="/" className="flex items-center gap-3 group">
      {/* Icon */}
      <div className={`relative ${sizeClasses[size]} flex-shrink-0`}>
        <div className="relative transition-all duration-500 group-hover:scale-105">
          <svg 
            width={iconSizeNum} 
            height={iconSizeNum} 
            viewBox="0 0 48 48" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-lg"
          >
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
              <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
              </radialGradient>
              <filter id="logoShadow">
                <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.2"/>
              </filter>
            </defs>
            
            {/* Glow effect */}
            <circle cx="24" cy="24" r="22" fill="url(#glowGrad)" className="opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Main shape - Hexagon with gradient */}
            <polygon 
              points="24,4 42,13 42,35 24,44 6,35 6,13" 
              fill="url(#logoGrad)" 
              stroke="white" 
              strokeWidth="2" 
              className="transition-all duration-300 group-hover:shadow-2xl" 
              filter="url(#logoShadow)"
            />
            
            {/* Inner geometric pattern */}
            <polygon points="24,12 32,18 32,30 24,36 16,30 16,18" fill="white" opacity="0.9" />
            <polygon points="24,18 28,22 28,26 24,30 20,26 20,22" fill="url(#logoGrad)" opacity="0.6" />
            
            {/* Center dot */}
            <circle cx="24" cy="24" r="3" fill="white" />
            
            {/* Decorative dots */}
            <circle cx="16" cy="14" r="1.5" fill="white" opacity="0.7" />
            <circle cx="32" cy="14" r="1.5" fill="white" opacity="0.7" />
            <circle cx="16" cy="34" r="1.5" fill="white" opacity="0.7" />
            <circle cx="32" cy="34" r="1.5" fill="white" opacity="0.7" />
            
            {/* Sparkle effects */}
            <circle cx="8" cy="8" r="1.5" fill="#a855f7" opacity="0.4" />
            <circle cx="40" cy="40" r="1.5" fill="#6366f1" opacity="0.4" />
          </svg>
        </div>
        
        {/* Pulsing ring animation */}
        <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 opacity-0 group-hover:opacity-100 animate-ping duration-1000" />
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <div className="flex items-center gap-0.5">
          <span className={`font-black tracking-tight text-[var(--foreground)] transition-colors duration-300 ${textSizeClass}`}>
            Navorika
          </span>
          <span className={`font-black tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent ${textSizeClass}`}>
            Pro
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] font-bold text-[var(--muted-foreground)] tracking-[0.15em] uppercase leading-none">
            200+ Free Tools · Client-Side
          </span>
        )}
      </div>
    </Link>
  );
}
