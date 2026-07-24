"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { 
  TrendingUp,
  FileText,
  Image as ImageIcon,
  Heart,
  Rocket,
  Code,
  Building2,
  ArrowRight,
} from "lucide-react";

// Support both old and new prop structures
interface CategoryCardProps {
  category: {
    name?: string;
    title?: string;
    slug?: string;
    href?: string;
    description: string;
    count?: number;
    tools?: number;
  };
  className?: string;
}

// Premium icon mapping with Lucide icons
const categoryIcons: Record<string, any> = {
  "Finance": TrendingUp,
  "PDF Tools": FileText,
  "Image Tools": ImageIcon,
  "Health": Heart,
  "productivity": Rocket,
  "Developer Tools": Code,
  "Construction": Building2,
};

// Premium color schemes
const categoryStyles: Record<string, {
  gradient: string;
  iconBg: string;
  badge: string;
}> = {
  "Finance": {
    gradient: "from-blue-500 to-blue-600",
    iconBg: "from-blue-500 to-blue-600",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  "PDF Tools": {
    gradient: "from-orange-500 to-orange-600",
    iconBg: "from-orange-500 to-orange-600",
    badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  },
  "Image Tools": {
    gradient: "from-purple-500 to-purple-600",
    iconBg: "from-purple-500 to-purple-600",
    badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
  "Health": {
    gradient: "from-emerald-500 to-emerald-600",
    iconBg: "from-emerald-500 to-emerald-600",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  "productivity": {
    gradient: "from-indigo-500 to-indigo-600",
    iconBg: "from-indigo-500 to-indigo-600",
    badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  },
  "Developer Tools": {
    gradient: "from-cyan-500 to-cyan-600",
    iconBg: "from-cyan-500 to-cyan-600",
    badge: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  },
  "Construction": {
    gradient: "from-amber-500 to-amber-600",
    iconBg: "from-amber-500 to-amber-600",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
};

export default function CategoryCard({ category, className }: CategoryCardProps) {
  // Support both name and title
  const categoryName = category.name || category.title || "";
  const categorySlug = category.slug || (category.href ? category.href.replace("/categories/", "") : "");
  const categoryCount = category.count || category.tools || 0;
  
  const IconComponent = categoryIcons[categoryName];
  const style = categoryStyles[categoryName] || categoryStyles["Finance"];

  return (
    <Link
      href={category.href || `/categories/${categorySlug}`}
      className={cn(
        "group relative block overflow-hidden rounded-2xl",
        "bg-white dark:bg-slate-800",
        "border border-slate-200/80 dark:border-slate-700/80",
        "shadow-lg transition-all duration-300",
        "hover:shadow-2xl hover:-translate-y-2",
        className
      )}
    >
      <div className="relative p-6 z-10">
        {/* Icon and Count */}
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            "flex h-16 w-16 items-center justify-center rounded-2xl",
            "bg-gradient-to-br shadow-lg",
            style.iconBg,
            "transition-transform duration-300 group-hover:scale-110"
          )}>
            {IconComponent && (
              <IconComponent className="h-8 w-8 text-white" />
            )}
          </div>
          <div className={cn(
            "px-3 py-1 rounded-full text-xs font-semibold",
            style.badge
          )}>
            {categoryCount} tools
          </div>
        </div>

        {/* Category Name */}
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          {categoryName}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
          {category.description}
        </p>

        {/* View all link */}
        <div className="flex items-center gap-2 text-sm font-medium text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">
          <span>Explore category</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>

      {/* Decorative glow effect */}
      <div className={cn(
        "absolute -bottom-16 -right-16 h-40 w-40 rounded-full",
        "opacity-0 group-hover:opacity-10 transition-opacity duration-500",
        `bg-gradient-to-br ${style.gradient}`,
        "blur-2xl"
      )} />
    </Link>
  );
}
