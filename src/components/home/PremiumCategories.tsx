"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const categories = [
  {
    name: "Finance",
    slug: "finance",
    description: "Loans, investments, taxes & more",
    count: 10,
    icon: "💰",
    color: "from-blue-500 to-blue-600",
    gradient: "hover:shadow-blue-500/20",
  },
  {
    name: "PDF Tools",
    slug: "pdf-tools",
    description: "Merge, split, compress & convert",
    count: 7,
    icon: "📄",
    color: "from-orange-500 to-orange-600",
    gradient: "hover:shadow-orange-500/20",
  },
  {
    name: "Image Tools",
    slug: "image-tools",
    description: "Compress, resize & edit",
    count: 6,
    icon: "🖼️",
    color: "from-purple-500 to-purple-600",
    gradient: "hover:shadow-purple-500/20",
  },
  {
    name: "Health",
    slug: "health",
    description: "Fitness, nutrition & wellness",
    count: 5,
    icon: "💪",
    color: "from-emerald-500 to-emerald-600",
    gradient: "hover:shadow-emerald-500/20",
  },
  {
    name: "Productivity",
    slug: "productivity",
    description: "Calculate, generate & more",
    count: 5,
    icon: "🚀",
    color: "from-indigo-500 to-indigo-600",
    gradient: "hover:shadow-indigo-500/20",
  },
  {
    name: "Developer",
    slug: "developer",
    description: "Format, encode & generate",
    count: 4,
    icon: "💻",
    color: "from-cyan-500 to-cyan-600",
    gradient: "hover:shadow-cyan-500/20",
  },
  {
    name: "Construction",
    slug: "construction",
    description: "Concrete, paint & more",
    count: 3,
    icon: "🏗️",
    color: "from-amber-500 to-amber-600",
    gradient: "hover:shadow-amber-500/20",
  },
];

export default function PremiumCategories() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Categories</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Explore Our
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-1">
              Tool Categories
            </span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Find the perfect tool for your needs across 7 specialized categories
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className={`group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${category.gradient} transition-all duration-700 opacity-0 translate-y-10`}
              style={{ 
                animation: `fadeInUp 0.6s ease forwards ${index * 0.1}s`,
                transitionDelay: `${index * 100}ms`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-slate-800/50" />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl shadow-lg`}>
                    {category.icon}
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  {category.description}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                    {category.count} tools
                  </span>
                </div>
              </div>

              {/* Glow Effect */}
              <div className={`absolute -bottom-16 -right-16 w-40 h-40 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity duration-500`} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
