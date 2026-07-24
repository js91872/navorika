"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { 
  TrendingUp,
  FileText,
  Image,
  Heart,
  Rocket,
  Code,
  Building2,
  ArrowRight 
} from "lucide-react";

interface CategoryCardProps {
  category: {
    name: string;
    slug: string;
    description: string;
    count: number;
    icon?: string;
  };
  className?: string;
}

const categoryIcons: Record<string, any> = {
  "Finance": TrendingUp,
  "PDF Tools": FileText,
  "Image Tools": Image,
  "Health": Heart,
  "productivity": Rocket,
  "Developer Tools": Code,
  "Construction": Building2,
};

const categoryColors: Record<string, string> = {
  "Finance": "from-blue-500 to-blue-600",
  "PDF Tools": "from-orange-500 to-orange-600",
  "Image Tools": "from-purple-500 to-purple-600",
  "Health": "from-emerald-500 to-emerald-600",
  "productivity": "from-indigo-500 to-indigo-600",
  "Developer Tools": "from-cyan-500 to-cyan-600",
  "Construction": "from-amber-500 to-amber-600",
};

const categoryEmojis: Record<string, string> = {
  "Finance": "💰",
  "PDF Tools": "📄",
  "Image Tools": "🖼️",
  "Health": "💪",
  "productivity": "🚀",
  "Developer Tools": "💻",
  "Construction": "🏗️",
};

export function CategoryCard({ category, className }: CategoryCardProps) {
  const IconComponent = categoryIcons[category.name];
  const colorClass = categoryColors[category.name] || "from-slate-500 to-slate-600";
  const emoji = categoryEmojis[category.name] || "📁";

  return (
    <Link
      href={`/categories/${category.slug}`}
      className={cn(
        "group relative block overflow-hidden rounded-2xl bg-white dark:bg-slate-800",
        "border border-slate-200/80 dark:border-slate-700/80",
        "shadow-lg shadow-slate-200/30 dark:shadow-slate-800/30",
        "transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-brand-500/10",
        className
      )}
    >
      {/* Gradient accent bar */}
      <div className={cn(
        "h-1 w-full bg-gradient-to-r",
        colorClass
      )} />

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            "flex h-14 w-14 items-center justify-center rounded-2xl",
            "bg-gradient-to-br shadow-lg shadow-brand-500/20",
            colorClass
          )}>
            {IconComponent ? (
              <IconComponent className="h-7 w-7 text-white" />
            ) : (
              <span className="text-2xl">{emoji}</span>
            )}
          </div>
          <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
        </div>

        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
          {category.name}
        </h3>
        
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
          {category.description}
        </p>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {category.count} tools
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
          <span className="text-xs text-brand-600 dark:text-brand-400 font-medium group-hover:underline">
            View all
          </span>
        </div>
      </div>

      {/* Subtle hover glow effect */}
      <div className={cn(
        "absolute -bottom-20 -right-20 h-40 w-40 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-2xl",
        "bg-gradient-to-r",
        colorClass
      )} />
    </Link>
  );
}
