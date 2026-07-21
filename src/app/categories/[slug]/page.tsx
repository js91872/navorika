import { getAllTools } from "@/lib/toolRegistry";
import Link from "next/link";
import { notFound } from "next/navigation";

// Map slugs to actual category names
const slugToCategory: Record<string, string> = {
  finance: "Finance",
  health: "Health",
  pdf: "PDF Tools",
  image: "Image Tools",
  developer: "Developer Tools",
  productivity: "productivity",
  construction: "Construction",
};

// Map slugs to display info
const categoryInfo: Record<string, { icon: string; description: string }> = {
  finance: { icon: "💰", description: "Financial calculators for loans, investments, taxes, and more." },
  health: { icon: "💪", description: "Health and wellness calculators for fitness, nutrition, and more." },
  pdf: { icon: "📄", description: "PDF utilities to merge, split, compress, and convert documents." },
  image: { icon: "🖼️", description: "Image tools to compress, resize, convert, and edit images." },
  developer: { icon: "💻", description: "Developer tools for formatting, encoding, generating IDs, and more." },
  productivity: { icon: "🚀", description: "Productivity tools to calculate dates, generate passwords, QR codes, and more." },
  construction: { icon: "🏗️", description: "Construction calculators for concrete, paint, and more." },
};

// Get individual tool icon based on title and keywords
function getToolIcon(tool: any): string {
  if (tool.icon) return tool.icon;
  
  const title = tool.title.toLowerCase();
  
  // Construction tools
  if (title.includes('concrete')) return '🏗️';
  if (title.includes('paint')) return '🎨';
  
  // Default icon based on category
  const categoryIcons: Record<string, string> = {
    'Finance': '💰',
    'Health': '💪',
    'PDF Tools': '📄',
    'Image Tools': '🖼️',
    'Developer Tools': '💻',
    'productivity': '🚀',
    'Construction': '🏗️',
  };
  
  return categoryIcons[tool.category] || '🔧';
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const allTools = getAllTools();
  
  const categoryName = slugToCategory[slug];
  
  if (!categoryName) {
    notFound();
  }
  
  const tools = allTools.filter(t => t.category === categoryName);
  
  if (tools.length === 0) {
    notFound();
  }
  
  const info = categoryInfo[slug] || { icon: "🔧", description: `${tools.length} tools available` };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Link href="/categories" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition mb-8 dark:text-blue-400 dark:hover:text-blue-300">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Categories
      </Link>
      
      <div className="flex items-center gap-4 mb-8">
        <span className="text-5xl">{info.icon}</span>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{categoryName}</h1>
          <p className="text-slate-600 dark:text-slate-400">{info.description}</p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">{tools.length} tools available</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const icon = getToolIcon(tool);
          return (
            <Link 
              key={tool.slug} 
              href={`/tools/${tool.slug}`} 
              className="block p-6 bg-white rounded-2xl border border-slate-200 hover:shadow-lg hover:border-blue-300 transition-all group dark:bg-slate-800 dark:border-slate-700 dark:hover:border-blue-500"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl" role="img" aria-label={tool.title}>{icon}</span>
                <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition dark:text-slate-200 dark:group-hover:text-blue-400">
                  {tool.title}
                </h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">{tool.shortDescription}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
