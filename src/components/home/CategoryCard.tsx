import Link from "next/link";
import { LucideIcon, ArrowRight } from "lucide-react";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  tools: number;
  href: string;
}

export default function CategoryCard({
  title,
  description,
  icon: Icon,
  tools,
  href,
}: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon size={28} />
      </div>

      <h3 className="text-xl font-semibold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-sm font-medium text-primary">
          {tools}+ Tools
        </span>

        <ArrowRight
          size={18}
          className="transition-transform group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}