import Container from "@/components/ui/Container";
import { ToolData } from "@/types/tool";

interface ToolHeroProps {
  tool: ToolData;
}

export default function ToolHero({
  tool,
}: ToolHeroProps) {
  return (
    <section className="border-b bg-muted/30 py-20">
      <Container>
        <div className="mx-auto max-w-4xl text-center">

          <h1 className="text-5xl font-bold tracking-tight">
            {tool.heroTitle ?? tool.title}
          </h1>

          <p className="mt-6 text-xl leading-8 text-muted-foreground">
            {tool.heroDescription ?? tool.description}
          </p>

        </div>
      </Container>
    </section>
  );
}