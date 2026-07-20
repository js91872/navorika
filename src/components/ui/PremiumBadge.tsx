"use client";

import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PremiumBadgeProps {
  className?: string;
}

export function PremiumBadge({ className }: PremiumBadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 px-2.5 py-0.5 text-xs font-medium text-white",
      className
    )}>
      <Crown className="h-3 w-3" />
      Pro
    </span>
  );
}
