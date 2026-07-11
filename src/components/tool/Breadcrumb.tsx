import Link from "next/link";
import { ChevronRight } from "lucide-react";

import Container from "@/components/ui/Container";
import { ToolData } from "@/types/tool";

interface BreadcrumbProps {
  tool: ToolData;
}

export default function Breadcrumb({
  tool,
}: BreadcrumbProps) {
  return (
    <Container>
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 py-6 text-sm text-slate-500"
      >
        <Link
          href="/"
          className="transition hover:text-blue-600"
        >
          Home
        </Link>

        <ChevronRight size={16} />

        <Link
          href={`/categories/${tool.category.toLowerCase()}`}
          className="transition hover:text-blue-600"
        >
          {tool.category}
        </Link>

        <ChevronRight size={16} />

        <span className="font-medium text-slate-900">
          {tool.title}
        </span>
      </nav>
    </Container>
  );
}