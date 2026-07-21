import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { Tool } from "@/types/tool";

interface BreadcrumbProps {
  tool: Tool;
}

export default function Breadcrumb({ tool }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 text-sm text-slate-500"
    >
      <Link
        href="/"
        className="transition hover:text-blue-600 flex items-center"
      >
        <Home size={16} />
      </Link>

      <ChevronRight size={16} />

      <Link
        href={`/categories/${tool.category.toLowerCase()}`}
        className="transition hover:text-blue-600 capitalize"
      >
        {tool.category}
      </Link>

      <ChevronRight size={16} />

      <span className="font-medium text-slate-900">
        {tool.title}
      </span>
    </nav>
  );
}
