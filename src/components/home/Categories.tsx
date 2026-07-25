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
  Sparkles
} from "lucide-react";

const categories = [
  {
    name: "Finance",
    slug: "finance",
    description: "Loans, investments, taxes & more",
    count: 10,
  },
  {
    name: "PDF Tools",
    slug: "pdf-tools",
    description: "Merge, split, compress & convert",
    count: 7,
  },
  {
    name: "Image Tools",
    slug: "image-tools",
    description: "Compress, resize & edit",
    count: 6,
  },
  {
    name: "Health",
    slug: "health",
    description: "Fitness, nutrition & wellness",
    count: 5,
  },
  {
    name: "productivity",
    slug: "productivity",
    description: "Calculate, generate & more",
    count: 5,
  },
  {
    name: "Developer Tools",
    slug: "developer",
    description: "Format, encode & generate",
    count: 4,
  },
  {
    name: "Construction",
    slug: "construction",
    description: "Construction calculators for concrete, paint & more",
    count: 3,
  },
];

// Category icons with Lucide components (same as your tool icons)
const categoryIcons: Record<string, any> = {
  "Finance": TrendingUp,
  "PDF Tools": FileText,
  "Image Tools": ImageIcon,
  "Health": Heart,
  "productivity": Rocket,
  "Developer Tools": Code,
  "Construction": Building2,
};

// Category gradient colors (matching your tool card colors)
const categoryColors: Record<string, string> = {
  "Finance": "from-blue-500 to-blue-600",
  "PDF Tools": "from-orange-500 to-orange-600",
  "Image Tools": "from-purple-500 to-purple-600",
  "Health": "from-emerald-500 to-emerald-600",
  "productivity": "from-indigo-500 to-indigo-600",
  "Developer Tools": "from-cyan-500 to-cyan-600",
  "Construction": "from-amber-500 to-amber-600",
};

const categoryBadges: Record<string, string> = {
  "Finance": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "PDF Tools": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  "Image Tools": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "Health": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "productivity": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  "Developer Tools": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  "Construction": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

export default function Categories() {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100/50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            <span>Categories</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Explore Our{" "}
            <span className="bg-gradient-to-r from-brand-600 to-brand-700 bg-clip-text text-transparent">
              Tool Categories
            </span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Discover powerful tools organized by category to help you with finance, health, documents, and more.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = categoryIcons[category.name];
            const color = categoryColors[category.name] || "from-slate-500 to-slate-600";
            const badge = categoryBadges[category.name] || "bg-slate-100 text-slate-700";

            return (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="group relative block overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative p-6 z-10">
                  {/* Icon and Count */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn(
                      "flex h-16 w-16 items-center justify-center rounded-2xl",
                      "bg-gradient-to-br shadow-lg",
                      color,
                      "transition-transform duration-300 group-hover:scale-110"
                    )}>
                      {IconComponent && (
                        <IconComponent className="h-8 w-8 text-white" />
                      )}
                    </div>
                    <div className={cn(
                      "px-3 py-1 rounded-full text-xs font-semibold",
                      badge
                    )}>
                      {category.count} tools
                    </div>
                  </div>

                  {/* Category Name */}
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                    {category.name}
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
                  `bg-gradient-to-br ${color}`,
                  "blur-2xl"
                )} />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
