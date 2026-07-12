import Container from "@/components/ui/Container";

interface ToolFormulaProps {
  formula?: string;
}

export default function ToolFormula({
  formula,
}: ToolFormulaProps) {
  if (!formula) {
    return null;
  }

  return (
    <section className="py-16">
      <Container>
        <div className="rounded-3xl border bg-card p-10">

          <h2 className="text-3xl font-bold">
            Formula
          </h2>

          <div className="mt-8 rounded-2xl bg-muted p-6 font-mono text-lg">
            {formula}
          </div>

        </div>
      </Container>
    </section>
  );
}