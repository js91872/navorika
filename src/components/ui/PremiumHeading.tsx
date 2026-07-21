"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PremiumHeadingProps {
  children: ReactNode;
  level?: "h1" | "h2" | "h3" | "h4";
  gradient?: boolean;
  className?: string;
  subtitle?: string;
}

export function PremiumHeading({
  children,
  level = "h2",
  gradient = false,
  className,
  subtitle,
}: PremiumHeadingProps) {
  const Tag = level;

  const baseStyles = "font-bold tracking-tight text-slate-900 dark:text-slate-50";

  const sizeStyles = {
    h1: "text-4xl sm:text-5xl lg:text-6xl leading-tight",
    h2: "text-3xl sm:text-4xl lg:text-5xl leading-tight",
    h3: "text-2xl sm:text-3xl lg:text-4xl leading-snug",
    h4: "text-xl sm:text-2xl lg:text-3xl leading-snug",
  };

  const gradientStyles = gradient && "text-gradient";

  return (
    <div className="space-y-2">
      <Tag
        className={cn(
          baseStyles,
          sizeStyles[level],
          gradientStyles,
          className
        )}
      >
        {children}
      </Tag>
      {subtitle && (
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
