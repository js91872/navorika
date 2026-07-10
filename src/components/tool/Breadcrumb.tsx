import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  category: string;
  title: string;
}

export default function Breadcrumb({
  category,
  title,
}: BreadcrumbProps) {
  return (
    <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
      <Link href="/" className="hover:text-primary">
        Home
      </Link>

      <ChevronRight size={16} />

      <Link
        href={`/categories/${category.toLowerCase()}`}
        className="hover:text-primary"
      >
        {category}
      </Link>

      <ChevronRight size={16} />

      <span className="font-medium text-foreground">
        {title}
      </span>
    </nav>
  );
}