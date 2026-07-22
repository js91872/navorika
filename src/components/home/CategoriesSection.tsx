"use client";

import Link from "next/link";
import { getAllTools } from "@/lib/toolRegistry";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { ArrowRight, Sparkles } from "lucide-react";

const categoryData: Record<string, { icon: string; description: string; color: string }> = {
  "Finance": { 
    icon: "💰", 
    description: "Calculators for loans, investments, taxes", 
    color: "from-emerald-500 to-teal-600" 
  },
  "Health": { 
    icon: "💪", 
    description: "Health calculators and ratings", 
    color: "from-red-500 to-rose-600" 
  },
  "PDF Tools": { 
    icon: "📄", 
    description: "PDF utilities - merge, split, compress", 
    color: "from-orange-500 to-amber-600" 
  },
  "Image Tools": { 
    icon: "🖼️", 
    description: "Compress, resize and edit images", 
    color: "from-purple-500 to-violet-600" 
  },
  "Developer Tools": { 
    icon: "💻", 
    description: "Format, encode and generate", 
    color: "from-cyan-500 to-blue-600" 
  },
  "productivity": { 
    icon: "🚀", 
    description: "Daily use tools to boost productivity", 
    color: "from-indigo-500 to-purple-600" 
  },
  "Construction": { 
    icon: "🏗️", 
    description: "Concrete, paint and tile calculators", 
    color: "from-amber-500 to-orange-600" 
  },
};

export default function CategoriesSection() {
  const allTools = getAllTools();
  
  const categories: Record<string, number> = {};
  allTools.forEach((tool) => {
    const cat = tool.category;
    categories[cat] = (categories[cat] || 0) + 1;
  });

  const sortedCategories = Object.entries(categories).sort((a, b) => b[1] - a[1]);

  return (
    <section className="py-16 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Browse by Categories
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Find the right tool for your needs
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedCategories.map(([category, count]) => {
            const data = categoryData[category] || { 
              icon: "🔧", 
              description: `${count} tools available`,
              color: "from-slate-500 to-slate-600" 
            };
            return (
              <Link
                key={category}
                href={`/categories/${category.toLowerCase()}`}
                className="group"
              >
                <PremiumCard hover className="h-full transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${data.color} text-xl flex-shrink-0`}>
                      {data.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
                          {category}
                        </h3>
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{data.description}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{count} tools</p>
                    </div>
                  </div>
                </PremiumCard>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 font-medium hover:gap-3 transition-all"
          >
            View all categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
