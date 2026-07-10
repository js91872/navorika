import Container from "@/components/ui/Container";
import { ToolData } from "@/types/tool";

interface ToolFAQProps {
  tool: ToolData;
}

export default function ToolFAQ({
  tool,
}: ToolFAQProps) {
  if (!tool.faq.length) return null;

  return (
    <section className="py-16">
      <Container>

        <h2 className="mb-10 text-3xl font-bold">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">

          {tool.faq.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl border bg-card p-6"
            >
              <h3 className="text-lg font-semibold">
                {item.question}
              </h3>

              <p className="mt-3 leading-7 text-muted-foreground">
                {item.answer}
              </p>
            </div>
          ))}

        </div>

      </Container>
    </section>
  );
}