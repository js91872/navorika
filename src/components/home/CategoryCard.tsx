"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Tool } from "@/types/tool";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  category: string;
  icon: string; // emoji icon
  description: string;
  color: string; // gradient class
  toolCount: number;
  tools: Tool[];
}

export default function CategoryCard({
  category,
  icon,
  description,
  color,
  toolCount,
  tools,
}: CategoryCardProps) {
  const categorySlug = category.toLowerCase();
  const previewTools = tools.slice(0, 4);

  return (
    <Link
      href={`/categories/${categorySlug}`}
      className="group block rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-xl hover:border-blue-200"
    >
      {/* Category Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl text-2xl bg-gradient-to-br",
            color
          )}>
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold capitalize text-slate-900">
              {category}
            </h3>
            <p className="text-sm text-slate-500">{toolCount} tools</p>
          </div>
        </div>
        <ArrowRight className="h-5 w-5 text-slate-400 transition group-hover:text-blue-600 group-hover:translate-x-1" />
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 mb-4 line-clamp-2">{description}</p>

      {/* Tool Preview */}
      <div className="flex flex-wrap gap-2">
        {previewTools.map((tool) => (
          <span
            key={tool.slug}
            className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600"
          >
            <span>{tool.icon || "🔧"}</span>
            {tool.title}
          </span>
        ))}
        {toolCount > 4 && (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-600">
            +{toolCount - 4} more
          </span>
        )}
      </div>
    </Link>
  );
}
