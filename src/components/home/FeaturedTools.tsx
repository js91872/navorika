"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { getAllTools } from "@/lib/toolRegistry";
import { Tool } from "@/types/tool";
import { PremiumHeading } from "@/components/ui/PremiumHeading";
import { PremiumBadge } from "@/components/ui/PremiumBadge";
import { ToolCard } from "@/components/ui/ToolCard";

export default function FeaturedTools() {
  const [featuredTools, setFeaturedTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tools = getAllTools();
    const featured = tools.filter(tool => tool.featured === true).slice(0, 6);
    setFeaturedTools(featured);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto animate-pulse" />
            <div className="h-12 w-64 bg-slate-200 dark:bg-slate-700 rounded-lg mx-auto mt-4 animate-pulse" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-slate-200 dark:bg-slate-700 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (featuredTools.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-premium">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <PremiumBadge variant="gradient" className="mb-4" icon={<Sparkles className="h-3.5 w-3.5" />}>
            Popular Tools
          </PremiumBadge>
          <PremiumHeading level="h2" gradient>
            Featured Tools
          </PremiumHeading>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Most popular and highly-rated tools on Navorika.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} variant="default" />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 font-medium hover:gap-3 transition-all"
          >
            View all tools
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
