"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PremiumBadgeProps {
  children: ReactNode;
  variant?: "blue" | "purple" | "green" | "orange" | "pink" | "gray" | "gradient";
  size?: "sm" | "md";
  className?: string;
  icon?: ReactNode;
}

export function PremiumBadge({
  children,
  variant = "blue",
  size = "md",
  className,
  icon,
}: PremiumBadgeProps) {
  const variants = {
    blue: "bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300",
    purple: "bg-accent-50 text-accent-700 dark:bg-accent-950/50 dark:text-accent-300",
    green: "bg-success-50 text-success-700 dark:bg-success-950/50 dark:text-success-300",
    orange: "bg-warning-50 text-warning-700 dark:bg-warning-950/50 dark:text-warning-300",
    pink: "bg-pink-50 text-pink-700 dark:bg-pink-950/50 dark:text-pink-300",
    gray: "bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300",
    gradient: "bg-gradient-to-r from-brand-600 via-accent-500 to-brand-600 text-white shadow-lg shadow-brand-500/20",
  };

  const sizes = {
    sm: "px-2.5 py-1 text-xs gap-1",
    md: "px-3.5 py-1.5 text-sm gap-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}
