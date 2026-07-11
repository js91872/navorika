import Container from "@/components/ui/Container";
import { ToolData } from "@/types/tool";

interface ToolFormulaProps {
  tool: ToolData;
}

export default function ToolFormula({
  tool,
}: ToolFormulaProps) {
  if (!tool.formula) {
    return null;
  }

  return (
    <section className="py-20">
      <Container>
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">

          <h2 className="text-3xl font-bold text-slate-900">
            Formula
          </h2>

          <div className="mt-8 overflow-x-auto rounded-2xl bg-slate-100 p-6 font-mono text-lg text-slate-800">
            {tool.formula}
          </div>

        </div>
      </Container>
    </section>
  );
}