import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return <ExpansionToolPage category="developer-tools" eyebrow="AI API cost planning" title="LLM API Cost Calculator" description="Estimate LLM API costs with editable input, output, and cached-token rates." slug="llm-api-cost-calculator"><BusinessCalculatorTool slug="llm-api-cost-calculator" /></ExpansionToolPage>;
}
