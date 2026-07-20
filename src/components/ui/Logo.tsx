"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: 'default' | 'compact' | 'icon-only';
}

export function Logo({ className, variant = 'default' }: LogoProps) {
  if (variant === 'icon-only') {
    return (
      <Link href="/" className={cn("flex items-center gap-2", className)}>
        <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
          <span className="text-xl font-black text-white">N</span>
          <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 opacity-20 blur-xl" />
        </div>
      </Link>
    );
  }

  return (
    <Link href="/" className={cn("flex items-center gap-3", className)}>
      <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
        <span className="text-xl font-black text-white">N</span>
        <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 opacity-20 blur-xl" />
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-bold tracking-tight text-slate-900">
          Navo
        </span>
        <span className="text-xl font-light text-blue-600">rika</span>
      </div>
    </Link>
  );
}
