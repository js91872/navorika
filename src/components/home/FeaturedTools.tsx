import Container from "@/components/ui/Container";
import ToolCard from "./ToolCard";

import { getFeaturedTools } from "@/lib/toolRegistry";

export default function FeaturedTools() {
  const featuredTools = getFeaturedTools();

  return (
    <section className="py-20">
      <Container>

        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold">
            Featured Tools
          </h2>

          <p className="mt-4 text-lg text-muted-foreground">
            Free online tools for everyone.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {featuredTools.map((tool) => (
            <ToolCard
              key={tool.slug}
              tool={tool}
            />
          ))}
        </div>

      </Container>
    </section>
  );
}