"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const categories = [
  { name: "finance", slug: "finance", icon: "💰", color: "from-blue-500 to-blue-600" },
  { name: "pdf_tools", slug: "pdf-tools", icon: "📄", color: "from-orange-500 to-orange-600" },
  { name: "image_tools", slug: "image-tools", icon: "🖼️", color: "from-purple-500 to-purple-600" },
  { name: "health", slug: "health", icon: "💪", color: "from-emerald-500 to-emerald-600" },
  { name: "productivity", slug: "productivity", icon: "🚀", color: "from-indigo-500 to-indigo-600" },
  { name: "developer", slug: "developer", icon: "💻", color: "from-cyan-500 to-cyan-600" },
  { name: "construction", slug: "construction", icon: "🏗️", color: "from-amber-500 to-amber-600" },
];

export default function PremiumCategories() {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>{t('categories.title')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            {t('categories.heading')}
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-1">
              {t('categories.subheading')}
            </span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t('categories.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              style={{ animation: `fadeInUp 0.6s ease forwards ${index * 0.1}s`, opacity: 0 }}
            >
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl shadow-lg`}>
                    {category.icon}
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {t(`categories.${category.name}`)}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
