"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Grid, List, Sparkles } from "lucide-react";
import { getAllTools } from "@/lib/toolRegistry";
import { Tool } from "@/types/tool";
import { PremiumHeading } from "@/components/ui/PremiumHeading";
import { PremiumBadge } from "@/components/ui/PremiumBadge";
import { ToolCard } from "@/components/ui/ToolCard";

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const allTools = getAllTools();
    setTools(allTools);
    setFilteredTools(allTools);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = tools.filter((tool) => {
        const query = searchQuery.toLowerCase();
        return (
          tool.title.toLowerCase().includes(query) ||
          tool.shortDescription.toLowerCase().includes(query) ||
          tool.category.toLowerCase().includes(query) ||
          tool.keywords.some((keyword) => keyword.toLowerCase().includes(query))
        );
      });
      setFilteredTools(filtered);
    } else {
      setFilteredTools(tools);
    }
  }, [searchQuery, tools]);

  if (loading) {
    return (
      <div className="min-h-screen bg-premium bg-dots">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="h-12 w-64 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse mb-4" />
          <div className="h-8 w-96 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse mb-8" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-slate-200 dark:bg-slate-700 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-premium bg-dots">
      <div className="fixed top-20 right-20 h-96 w-96 rounded-full bg-brand-400/10 blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-20 h-96 w-96 rounded-full bg-accent-400/10 blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8">
          <PremiumBadge variant="gradient" className="mb-3" icon={<Sparkles className="h-3.5 w-3.5" />}>
            {tools.length} Tools Available
          </PremiumBadge>
          <PremiumHeading level="h1">All Tools</PremiumHeading>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Browse our collection of free online tools
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools..."
              className="w-full rounded-xl border border-slate-200/80 bg-white/50 pl-10 pr-4 py-3 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200 dark:placeholder:text-slate-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-xl px-4 py-2.5 transition ${
                viewMode === "grid"
                  ? "bg-brand-600 text-white shadow-lg shadow-brand-500/30"
                  : "border border-slate-200/80 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-xl px-4 py-2.5 transition ${
                viewMode === "list"
                  ? "bg-brand-600 text-white shadow-lg shadow-brand-500/30"
                  : "border border-slate-200/80 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Showing {filteredTools.length} of {tools.length} tools
        </div>

        {viewMode === "grid" ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} variant="default" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} variant="compact" />
            ))}
          </div>
        )}

        {filteredTools.length === 0 && (
          <div className="text-center py-16">
            <Search className="h-16 w-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">No tools found</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
}
