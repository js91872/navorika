import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return <ExpansionToolPage category="developer-tools" eyebrow="AI workload planning" title="AI Token Calculator" description="Estimate input and output token volume per request, day, month, and year." slug="ai-token-calculator"><BusinessCalculatorTool slug="ai-token-calculator" /></ExpansionToolPage>;
}
