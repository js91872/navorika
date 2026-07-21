"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PremiumCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  padding?: "sm" | "md" | "lg" | "none";
  border?: boolean;
}

export function PremiumCard({
  children,
  className,
  hover = true,
  glass = false,
  padding = "md",
  border = true,
}: PremiumCardProps) {
  const baseStyles = "relative rounded-2xl transition-all duration-300";

  const hoverStyles = hover && "hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-slate-800/50";

  const glassStyles = glass && "bg-white/70 backdrop-blur-xl backdrop-saturate-150 dark:bg-slate-900/70";

  const paddingStyles = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const borderStyles = border && "border border-slate-200/80 dark:border-slate-700/80";

  return (
    <div
      className={cn(
        baseStyles,
        hoverStyles,
        glassStyles,
        paddingStyles[padding],
        borderStyles,
        className
      )}
    >
      {children}
    </div>
  );
}
