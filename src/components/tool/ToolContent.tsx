import Container from "@/components/ui/Container";
import { ToolData } from "@/types/tool";

interface ToolContentProps {
  tool: ToolData;
}

export default function ToolContent({
  tool,
}: ToolContentProps) {
  if (!tool.introduction) {
    return null;
  }

  return (
    <section className="py-20">
      <Container>
        <div className="mx-auto max-w-4xl">

          <h2 className="mb-8 text-4xl font-bold tracking-tight text-slate-900">
            About {tool.title}
          </h2>

          <div className="prose prose-lg max-w-none text-slate-600">
            <p>{tool.introduction}</p>
          </div>

        </div>
      </Container>
    </section>
  );
}