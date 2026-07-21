import Link from "next/link";
import { getAllTools } from "@/lib/toolRegistry";

// Category icons and colors
const categoryData: Record<string, { icon: string; color: string; description: string; slug: string }> = {
  "Finance": { icon: "💰", color: "from-emerald-500 to-teal-600", description: "Loans, investments, taxes & more", slug: "finance" },
  "Health": { icon: "💪", color: "from-red-500 to-rose-600", description: "Fitness, nutrition & wellness", slug: "health" },
  "PDF Tools": { icon: "📄", color: "from-orange-500 to-amber-600", description: "Merge, split, compress & convert", slug: "pdf" },
  "Image Tools": { icon: "🖼️", color: "from-purple-500 to-violet-600", description: "Compress, resize & edit", slug: "image" },
  "Developer Tools": { icon: "💻", color: "from-cyan-500 to-blue-600", description: "Format, encode & generate", slug: "developer" },
  "productivity": { icon: "🚀", color: "from-indigo-500 to-purple-600", description: "Calculate, generate & more", slug: "productivity" },
  "Construction": { icon: "🏗️", color: "from-amber-500 to-orange-600", description: "Construction calculators for concrete, paint & more", slug: "construction" },
};

export default function CategoriesPage() {
  const allTools = getAllTools();
  
  // Group tools by category
  const categories: Record<string, number> = {};
  allTools.forEach((tool) => {
    const cat = tool.category;
    categories[cat] = (categories[cat] || 0) + 1;
  });

  const sortedCategories = Object.entries(categories).sort((a, b) => b[1] - a[1]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4 dark:text-slate-100">Browse Tools by Category</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Find the perfect tool for your needs. Explore {allTools.length} tools across {sortedCategories.length} categories.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedCategories.map(([category, count]) => {
          const data = categoryData[category] || { 
            icon: "🔧", 
            color: "from-slate-500 to-slate-600", 
            description: `${count} tools available`,
            slug: category.toLowerCase().replace(/\s+/g, '-')
          };
          return (
            <Link
              key={category}
              href={`/categories/${data.slug}`}
              className="group block p-6 bg-white rounded-2xl border border-slate-200 hover:shadow-xl hover:border-blue-300 transition-all dark:bg-slate-800 dark:border-slate-700 dark:hover:border-blue-500"
            >
              <div className="flex items-start gap-4">
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl text-3xl bg-gradient-to-br ${data.color}`}>
                  {data.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-slate-900 group-hover:text-blue-600 transition dark:text-slate-100 dark:group-hover:text-blue-400">
                    {category}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{count} tools • {data.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
