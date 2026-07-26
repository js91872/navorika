"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const categories = [
  { name: "Finance", slug: "finance", icon: "💰", color: "from-blue-500 to-blue-600" },
  { name: "PDF Tools", slug: "pdf", icon: "📄", color: "from-orange-500 to-orange-600" },
  { name: "Image Tools", slug: "image", icon: "🖼️", color: "from-purple-500 to-purple-600" },
  { name: "Health", slug: "health", icon: "💪", color: "from-emerald-500 to-emerald-600" },
  { name: "Productivity", slug: "productivity", icon: "🚀", color: "from-indigo-500 to-indigo-600" },
  { name: "Developer Tools", slug: "developer", icon: "💻", color: "from-cyan-500 to-cyan-600" },
  { name: "Construction", slug: "construction", icon: "🏗️", color: "from-amber-500 to-amber-600" },
];

export default function PremiumCategories() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="py-16 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className={`text-center mb-10 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 text-sm font-medium mb-3">
            <Sparkles className="w-4 h-4" />
            <span>Categories</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Explore Our
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Tool Categories
            </span>
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Find the perfect tool for your needs across 7 specialized categories
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group relative overflow-hidden rounded-xl bg-white dark:bg-slate-800 p-4 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
              style={{ animation: `fadeInUp 0.6s ease forwards ${index * 0.1}s`, opacity: 0 }}
            >
              <div className="relative">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl shadow-lg mx-auto mb-2`}>
                  {category.icon}
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
