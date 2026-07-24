"use client";

import Link from "next/link";
import { Tool } from "@/types/tool";
import { cn } from "@/lib/utils";
import { ArrowRight, Sparkles, TrendingUp, Users, Star } from "lucide-react";
import { getToolIcon, getIconColor } from "@/lib/toolIcons";
import { PremiumBadge } from "./PremiumBadge";

interface PremiumToolCardProps {
  tool: Tool;
  variant?: "default" | "featured" | "compact";
  className?: string;
}

export function PremiumToolCard({ tool, variant = "default", className }: PremiumToolCardProps) {
  const Icon = getToolIcon(tool.slug);
  const iconColor = getIconColor(tool.slug);

  const getCategoryColor = () => {
    const colors: Record<string, string> = {
      "Finance": "from-brand-500 to-brand-600",
      "Health": "from-success-500 to-success-600",
      "PDF Tools": "from-warning-500 to-warning-600",
      "Image Tools": "from-accent-500 to-accent-600",
      "Developer Tools": "from-cyan-500 to-blue-600",
      "productivity": "from-indigo-500 to-purple-600",
      "Construction": "from-amber-500 to-orange-600",
    };
    return colors[tool.category] || "from-slate-400 to-slate-500";
  };

  const getCategoryEmoji = () => {
    const emojis: Record<string, string> = {
      "Finance": "💰",
      "Health": "💪",
      "PDF Tools": "📄",
      "Image Tools": "🖼️",
      "Developer Tools": "💻",
      "productivity": "🚀",
      "Construction": "🏗️",
    };
    return emojis[tool.category] || "🔧";
  };

  return (
    <Link href={`/tools/${tool.slug}`} className="group block h-full">
      <div className={cn(
        "relative h-full rounded-2xl bg-white dark:bg-slate-800 transition-all duration-300",
        "hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-brand-500/10 dark:hover:shadow-brand-500/5",
        "shadow-lg shadow-slate-200/30 dark:shadow-slate-800/30",
        "border border-slate-200/80 dark:border-slate-700/80",
        "hover:border-brand-200/50 dark:hover:border-brand-800/50",
        className
      )}>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/50 to-transparent dark:from-slate-800/50 pointer-events-none" />
        
        <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${getCategoryColor()}`} />

        <div className="relative p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${getCategoryColor()} shadow-lg shadow-brand-500/20 flex-shrink-0 transition-transform group-hover:scale-105`}>
                {Icon && <Icon className={`h-7 w-7 ${iconColor}`} />}
                {!Icon && <span className="text-2xl">{getCategoryEmoji()}</span>}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
                  {tool.title}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {getCategoryEmoji()} {tool.category}
                  </span>
                  {tool.featured && (
                    <PremiumBadge variant="gradient" size="sm" className="text-[10px] px-2 py-0.5">
                      Featured
                    </PremiumBadge>
                  )}
                </div>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
            {tool.shortDescription}
          </p>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {tool.keywords?.slice(0, 3).map((keyword) => (
              <span 
                key={keyword} 
                className="text-[10px] bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-full font-medium"
              >
                {keyword}
              </span>
            ))}
            {tool.keywords && tool.keywords.length > 3 && (
              <span className="text-[10px] text-slate-400 dark:text-slate-500 px-1">
                +{tool.keywords.length - 3}
              </span>
            )}
          </div>

          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-1.5 text-xs text-brand-600 dark:text-brand-400 font-medium">
              <span>View Tool</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
