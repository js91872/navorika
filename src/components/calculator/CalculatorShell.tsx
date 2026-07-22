"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CalculatorShellProps {
  children: ReactNode;
  className?: string;
  showTrustBadges?: boolean;
}

export default function CalculatorShell({ 
  children, 
  className,
  showTrustBadges = false,
}: CalculatorShellProps) {
  return (
    <div
      className={cn(
        "relative",
        className
      )}
    >
      {/* Subtle background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50/30 via-transparent to-accent-50/30 pointer-events-none dark:from-brand-950/10 dark:to-accent-950/10" />
      
      <div className="relative">
        {children}
      </div>
    </div>
  );
}
