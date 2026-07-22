import { getAllTools } from "@/lib/toolRegistry";
import Container from "@/components/ui/Container";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen bg-premium bg-dots py-12">
      <Container>
        <Link href="/categories" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 transition mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Categories
        </Link>
        
        <div className="flex items-center gap-4 mb-8">
          <span className="text-5xl">{info.icon}</span>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{categoryName}</h1>
            <p className="text-slate-600 dark:text-slate-400">{info.description}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{tools.length} tools available</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </Container>
    </div>
  );
}
