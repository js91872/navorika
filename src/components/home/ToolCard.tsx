import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ToolCardProps {
  title: string;
  description: string;
  category: string;
  badge?: string;
}

export default function ToolCard({
  title,
  description,
  category,
  badge,
}: ToolCardProps) {
  return (
    <div className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

      <div className="flex items-center justify-between">

        <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700">
          {category}
        </span>

        {badge && (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            {badge}
          </span>
        )}

      </div>

      <h3 className="mt-8 text-2xl font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-4 leading-7 text-slate-600">
        {description}
      </p>

      <Link
        href="#"
        className="mt-8 inline-flex items-center gap-2 font-semibold text-blue-600 transition-colors hover:text-blue-700"
      >
        Open Tool
        <ArrowRight
          size={18}
          className="transition-transform group-hover:translate-x-1"
        />
      </Link>

    </div>
  );
}