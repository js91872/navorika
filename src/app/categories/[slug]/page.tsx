import { getAllTools } from "@/lib/toolRegistry";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { PremiumGradient } from "@/components/ui/PremiumGradient";
import { PremiumHeading } from "@/components/ui/PremiumHeading";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { PremiumBadge } from "@/components/ui/PremiumBadge";
import { PremiumButton } from "@/components/ui/PremiumButton";

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

// Get individual tool icon
function getToolIcon(tool: any): string {
  if (tool.icon) return tool.icon;
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
    <PremiumGradient variant="section">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition dark:text-slate-400 dark:hover:text-blue-400 mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Categories
        </Link>
        
        {/* Category Header */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 text-5xl dark:from-blue-500/20 dark:to-purple-500/20 shadow-lg shadow-blue-500/10">
              {info.icon}
            </div>
            <div>
              <PremiumHeading level="h1">{categoryName}</PremiumHeading>
              <p className="text-slate-600 dark:text-slate-400 mt-1">{info.description}</p>
              <div className="flex items-center gap-3 mt-3">
                <PremiumBadge variant="blue" icon={<Sparkles className="h-3.5 w-3.5" />}>
                  {tools.length} tools available
                </PremiumBadge>
              </div>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => {
            const icon = getToolIcon(tool);
            return (
              <Link 
                key={tool.slug} 
                href={`/tools/${tool.slug}`}
                className="group"
              >
                <PremiumCard 
                  hover 
                  className="h-full transition-all duration-300 group-hover:border-blue-200/50 dark:group-hover:border-blue-800/50"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-3xl">{icon}</span>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                        {tool.title}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                        {tool.shortDescription}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {tool.keywords?.slice(0, 3).map((keyword) => (
                      <span 
                        key={keyword} 
                        className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </PremiumCard>
              </Link>
            );
          })}
        </div>
      </div>
    </PremiumGradient>
  );
}
