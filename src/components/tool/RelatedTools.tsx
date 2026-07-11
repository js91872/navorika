import Link from "next/link";

import Container from "@/components/ui/Container";
import { ToolData } from "@/types/tool";

interface RelatedToolsProps {
  tool: ToolData;
}

export default function RelatedTools({
  tool,
}: RelatedToolsProps) {
  if (!tool.relatedTools || tool.relatedTools.length === 0) {
    return null;
  }

  return (
    <section className="bg-slate-50 py-20">
      <Container>
        <div className="mx-auto max-w-5xl">

          <h2 className="mb-10 text-4xl font-bold tracking-tight text-slate-900">
            Related Tools
          </h2>

          <div className="grid gap-6 md:grid-cols-2">

            {tool.relatedTools.map((slug) => (
              <Link
                key={slug}
                href={`/tools/${slug}`}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg"
              >
                <h3 className="text-xl font-semibold text-slate-900 transition-colors group-hover:text-blue-600">
                  {slug
                    .split("-")
                    .map(
                      (word) =>
                        word.charAt(0).toUpperCase() + word.slice(1)
                    )
                    .join(" ")}
                </h3>

                <p className="mt-2 text-slate-600">
                  Explore this related tool.
                </p>
              </Link>
            ))}

          </div>

        </div>
      </Container>
    </section>
  );
}