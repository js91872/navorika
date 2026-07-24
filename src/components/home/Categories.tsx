"use client";

import { CategoryCard } from "./CategoryCard";
import { Sparkles } from "lucide-react";

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

export default function Categories() {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
