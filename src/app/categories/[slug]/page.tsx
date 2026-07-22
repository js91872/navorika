import { getAllTools } from "@/lib/toolRegistry";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { PremiumHeading } from "@/components/ui/PremiumHeading";
import { PremiumBadge } from "@/components/ui/PremiumBadge";
import { ToolCard } from "@/components/ui/ToolCard";

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
    <div className="min-h-screen bg-premium bg-dots">
      <div className="fixed top-20 left-20 h-96 w-96 rounded-full bg-brand-400/10 blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 right-20 h-96 w-96 rounded-full bg-accent-400/10 blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 transition dark:text-slate-400 dark:hover:text-brand-400 mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Categories
        </Link>
        
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-500/10 to-accent-500/10 text-5xl dark:from-brand-500/20 dark:to-accent-500/20 shadow-lg shadow-brand-500/10">
              {info.icon}
            </div>
            <div>
              <PremiumHeading level="h1">{categoryName}</PremiumHeading>
              <p className="text-slate-600 dark:text-slate-400 mt-1">{info.description}</p>
              <div className="flex items-center gap-3 mt-3">
                <PremiumBadge variant="gradient" icon={<Sparkles className="h-3.5 w-3.5" />}>
                  {tools.length} tools available
                </PremiumBadge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} variant="default" />
          ))}
        </div>
      </div>
    </div>
  );
}
