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
  showTrustBadges = true,
}: CalculatorShellProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-indigo-50/30 pointer-events-none dark:from-blue-950/20 dark:to-indigo-950/20" />
      
      {showTrustBadges && (
        <div className="relative flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/80 px-6 py-3 text-xs text-slate-500 sm:px-8 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="flex h-1.5 w-1.5 rounded-full bg-green-500" />
            Trusted by 50,000+ users
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-blue-600 dark:text-blue-400">★</span>
            4.9/5 rating
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">⚡</span>
            &lt;1 second results
          </div>
        </div>
      )}
      
      <div className="relative">
        {children}
      </div>
    </div>
  );
}
