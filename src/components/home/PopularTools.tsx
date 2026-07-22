"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { getAllTools } from "@/lib/toolRegistry";
import { Tool } from "@/types/tool";
import { PremiumBadge } from "@/components/ui/PremiumBadge";

export default function PopularTools() {
  const [popularTools, setPopularTools] = useState<Tool[]>([]);

  useEffect(() => {
    const tools = getAllTools();
    // Get popular tools (those with popular flag or first 6)
    const popular = tools.filter(t => t.popular === true).slice(0, 6);
    if (popular.length < 6) {
      const remaining = tools.filter(t => t.popular !== true).slice(0, 6 - popular.length);
      setPopularTools([...popular, ...remaining]);
    } else {
      setPopularTools(popular);
    }
  }, []);

  if (popularTools.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Popular Tools
            </h2>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              Most used tools by our community
            </p>
          </div>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 font-medium hover:gap-3 transition-all text-sm"
          >
            View all tools
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popularTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group block"
            >
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/10 dark:hover:shadow-brand-500/5 hover:border-brand-200/50 dark:hover:border-brand-800/50">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{tool.icon || "🔧"}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
                      {tool.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                      {tool.shortDescription}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </div>
                {tool.popular && (
                  <div className="mt-2">
                    <PremiumBadge variant="gradient" size="sm" icon={<TrendingUp className="h-3 w-3" />}>
                      Popular
                    </PremiumBadge>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
