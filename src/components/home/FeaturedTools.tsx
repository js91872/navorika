import Container from "@/components/ui/Container";
import ToolCard from "./ToolCard";
import { featuredTools } from "@/data/featuredTools";

export default function FeaturedTools() {
  return (
    <section className="bg-slate-50 py-28">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-5xl font-black tracking-tight">
            Featured Tools
          </h2>

          <p className="mt-6 text-xl text-slate-600">
            Discover our most popular tools, trusted by users every day.
          </p>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {featuredTools.map((tool) => (
            <ToolCard
              key={tool.id}
              title={tool.title}
              description={tool.description}
              category={tool.category}
              badge={tool.badge}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}