"use client";

import { CategoryCard } from "./CategoryCard";

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

export function CategoriesSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Explore Our Tools
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Discover powerful tools organized by category to help you with finance, health, documents, and more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
