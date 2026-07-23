"use client";

import { Tool } from "@/types/tool";
import { PremiumToolCard } from "./PremiumToolCard";
import { Sparkles } from "lucide-react";
import { PremiumBadge } from "./PremiumBadge";
import { PremiumHeading } from "./PremiumHeading";

interface PremiumToolGridProps {
  tools: Tool[];
  title?: string;
  subtitle?: string;
  columns?: 2 | 3 | 4;
  variant?: "default" | "featured" | "compact";
  showBadge?: boolean;
}

export function PremiumToolGrid({
  tools,
  title,
  subtitle,
  columns = 3,
  variant = "default",
  showBadge = true,
}: PremiumToolGridProps) {
  if (tools.length === 0) return null;

  const gridCols = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className="space-y-6">
      {title && (
        <div className="flex items-center justify-between">
          <div>
            <PremiumBadge variant="gradient" className="mb-2" icon={<Sparkles className="h-3.5 w-3.5" />}>
              {tools.length} Tools Available
            </PremiumBadge>
            <PremiumHeading level="h2">{title}</PremiumHeading>
            {subtitle && (
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}
      
      <div className={`grid gap-4 ${gridCols[columns]}`}>
        {tools.map((tool) => (
          <PremiumToolCard 
            key={tool.slug} 
            tool={tool} 
            variant={variant}
            showBadge={showBadge}
          />
        ))}
      </div>
    </div>
  );
}
