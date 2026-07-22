"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import { getAllTools } from "@/lib/toolRegistry";

// Category mapping with correct slugs
const categoryMap: Record<string, { 
  slug: string; 
  bg: string; 
  icon: string; 
  description: string;
}> = {
  "Finance": {
    slug: "finance",
    bg: "from-emerald-500 to-teal-600",
    icon: "💰",
    description: "Loans, investments, taxes & more",
  },
  "Health": {
    slug: "health",
    bg: "from-red-500 to-rose-600",
    icon: "💪",
    description: "Fitness, nutrition & wellness",
  },
  "PDF Tools": {
    slug: "pdf",
    bg: "from-orange-500 to-amber-600",
    icon: "📄",
    description: "Merge, split, compress & convert",
  },
  "Image Tools": {
    slug: "image",
    bg: "from-purple-500 to-violet-600",
    icon: "🖼️",
    description: "Compress, resize & edit images",
  },
  "Developer Tools": {
    slug: "developer",
    bg: "from-cyan-500 to-blue-600",
    icon: "💻",
    description: "Format, encode & generate",
  },
  "productivity": {
    slug: "productivity",
    bg: "from-indigo-500 to-purple-600",
    icon: "🚀",
    description: "Calculate, generate & more",
  },
  "Construction": {
    slug: "construction",
    bg: "from-amber-500 to-orange-600",
    icon: "🏗️",
    description: "Concrete, paint & tile calculators",
  },
};

export default function CategoryGrid() {
  const allTools = getAllTools();
  
  const categories = allTools.reduce((acc, tool) => {
    const cat = tool.category;
    if (!acc[cat]) {
      acc[cat] = { count: 0, tools: [] };
    }
    acc[cat].count++;
    acc[cat].tools.push(tool);
    return acc;
  }, {} as Record<string, { count: number; tools: typeof allTools }>);
  
  const sortedCategories = Object.entries(categories).sort((a, b) => b[1].count - a[1].count);

  return (
    <section className="py-16 bg-white dark:bg-slate-900">
      <Container>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Browse by Categories</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Find the right tool for your needs</p>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedCategories.map(([category, data]) => {
            const meta = categoryMap[category] || {
              slug: category.toLowerCase().replace(/\s+/g, '-'),
              bg: "from-slate-500 to-slate-600",
              icon: "🔧",
              description: `${data.count} tools available`,
            };
            
            return (
              <Link
                key={category}
                href={`/categories/${meta.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-700"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${meta.bg} text-2xl`}>
                    {meta.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold capitalize text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
                      {category}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{data.count} tools</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 group-hover:translate-x-1 transition" />
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{meta.description}</p>
              </Link>
            );
          })}
        </div>
        
        <div className="text-center mt-8">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:text-brand-700 font-medium"
          >
            View all categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
