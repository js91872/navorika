import { getAllTools } from "@/lib/toolRegistry";
import Container from "@/components/ui/Container";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ToolCard } from "@/components/ui/ToolCard";

export default function DeveloperCategoryPage() {
  const allTools = getAllTools();
  const tools = allTools.filter(t => t.category === "Developer Tools");

  return (
    <div className="min-h-screen bg-premium bg-dots py-12">
      <Container>
        <Link href="/categories" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 transition mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Categories
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Developer Tools</h1>
          <p className="text-slate-600 dark:text-slate-400">Developer tools for formatting, encoding, generating IDs, and more.</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{tools.length} tools available</p>
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
