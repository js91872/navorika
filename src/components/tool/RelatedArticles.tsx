import Link from "next/link";

import Container from "@/components/ui/Container";
import { ToolData } from "@/types/tool";

interface RelatedArticlesProps {
  tool: ToolData;
}

export default function RelatedArticles({
  tool,
}: RelatedArticlesProps) {
  if (!tool.relatedArticles || tool.relatedArticles.length === 0) {
    return null;
  }

  return (
    <section className="py-20">
      <Container>
        <div className="mx-auto max-w-5xl">

          <h2 className="mb-10 text-4xl font-bold tracking-tight text-slate-900">
            Learn More
          </h2>

          <div className="grid gap-6 md:grid-cols-2">

            {tool.relatedArticles.map((slug) => (
              <Link
                key={slug}
                href={`/blog/${slug}`}
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
                  Read our detailed guide on this topic.
                </p>
              </Link>
            ))}

          </div>

        </div>
      </Container>
    </section>
  );
}