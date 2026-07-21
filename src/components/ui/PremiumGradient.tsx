"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PremiumGradientProps {
  children: ReactNode;
  variant?: "hero" | "section" | "subtle" | "accent";
  className?: string;
}

export function PremiumGradient({
  children,
  variant = "subtle",
  className,
}: PremiumGradientProps) {
  const variants = {
    hero: "relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/30",
    section: "relative overflow-hidden bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/50",
    subtle: "relative overflow-hidden bg-gradient-to-br from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-800/30",
    accent: "relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600",
  };

  return (
    <div className={cn(variants[variant], className)}>
      {variant !== "accent" && (
        <>
          <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/3 translate-y-1/3 rounded-full bg-purple-400/20 blur-3xl" />
        </>
      )}
      <div className="relative">{children}</div>
    </div>
  );
}
