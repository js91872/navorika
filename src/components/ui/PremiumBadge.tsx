"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PremiumBadgeProps {
  children: ReactNode;
  variant?: "blue" | "purple" | "green" | "orange" | "pink" | "gray";
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
    blue: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
    purple: "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300",
    green: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    orange: "bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300",
    pink: "bg-pink-50 text-pink-700 dark:bg-pink-950/50 dark:text-pink-300",
    gray: "bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300",
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
