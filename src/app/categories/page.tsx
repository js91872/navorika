import Link from "next/link";
import { getAllTools } from "@/lib/toolRegistry";
import { PremiumGradient } from "@/components/ui/PremiumGradient";
import { PremiumHeading } from "@/components/ui/PremiumHeading";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { PremiumBadge } from "@/components/ui/PremiumBadge";
import { ArrowRight, Sparkles, TrendingUp, Users, Star } from "lucide-react";

// Category icons and colors
const categoryData: Record<string, { icon: string; color: string; description: string; slug: string }> = {
  "Finance": { icon: "💰", color: "from-brand-500 to-brand-600", description: "Loans, investments, taxes & more", slug: "finance" },
  "Health": { icon: "💪", color: "from-success-500 to-success-600", description: "Fitness, nutrition & wellness", slug: "health" },
  "PDF Tools": { icon: "📄", color: "from-warning-500 to-warning-600", description: "Merge, split, compress & convert", slug: "pdf" },
  "Image Tools": { icon: "🖼️", color: "from-accent-500 to-accent-600", description: "Compress, resize & edit", slug: "image" },
  "Developer Tools": { icon: "💻", color: "from-cyan-500 to-blue-600", description: "Format, encode & generate", slug: "developer" },
  "productivity": { icon: "🚀", color: "from-indigo-500 to-purple-600", description: "Calculate, generate & more", slug: "productivity" },
  "Construction": { icon: "🏗️", color: "from-amber-500 to-orange-600", description: "Construction calculators for concrete, paint & more", slug: "construction" },
};

export default function CategoriesPage() {
  const allTools = getAllTools();
  
  const categories: Record<string, number> = {};
  allTools.forEach((tool) => {
    const cat = tool.category;
    categories[cat] = (categories[cat] || 0) + 1;
  });

  const sortedCategories = Object.entries(categories).sort((a, b) => b[1] - a[1]);

  return (
    <div className="bg-gradient-to-b from-brand-50/50 via-white to-accent-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-accent-950/30">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <PremiumBadge variant="gradient" className="mb-4" icon={<Sparkles className="h-3.5 w-3.5" />}>
            {sortedCategories.length} Categories
          </PremiumBadge>
          <PremiumHeading level="h1" gradient>
            Browse Tools by Category
          </PremiumHeading>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Find the perfect tool for your needs. Explore {allTools.length} tools across {sortedCategories.length} categories.
          </p>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedCategories.map(([category, count]) => {
            const data = categoryData[category] || { 
              icon: "🔧", 
              color: "from-slate-400 to-slate-500", 
              description: `${count} tools available`,
              slug: category.toLowerCase().replace(/\s+/g, '-')
            };
            return (
              <Link
                key={category}
                href={`/categories/${data.slug}`}
                className="group"
              >
                <PremiumCard 
                  hover 
                  className="h-full transition-all duration-300 group-hover:border-brand-200/50 dark:group-hover:border-brand-800/50 group-hover:shadow-brand-100/20 dark:group-hover:shadow-brand-900/20"
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${data.color} text-2xl shadow-lg shadow-brand-500/20 flex-shrink-0`}>
                      {data.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
                          {category}
                        </h2>
                        <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{data.description}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <PremiumBadge variant="gray" size="sm">
                          {count} tools
                        </PremiumBadge>
                        <span className="text-xs text-slate-400 dark:text-slate-500">→</span>
                      </div>
                    </div>
                  </div>
                </PremiumCard>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
