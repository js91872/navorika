import Container from "@/components/ui/Container";
import { ToolData } from "@/types/tool";

interface ToolExamplesProps {
  tool: ToolData;
}

export default function ToolExamples({
  tool,
}: ToolExamplesProps) {
  if (!tool.examples || tool.examples.length === 0) {
    return null;
  }

  return (
    <section className="bg-slate-50 py-20">
      <Container>
        <div className="mx-auto max-w-4xl">

          <h2 className="mb-10 text-4xl font-bold tracking-tight text-slate-900">
            Examples
          </h2>

          <div className="space-y-6">
            {tool.examples.map((example, index) => (
              <div
                key={index}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
              >
                <h3 className="text-2xl font-semibold text-slate-900">
                  {example.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {example.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </Container>
    </section>
  );
}