import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return <ExpansionToolPage category="finance-calculators" eyebrow="SaaS retention metric" title="Net Revenue Retention Calculator" description="Calculate NRR from starting revenue, expansion, contraction, and churn." slug="net-revenue-retention-calculator"><BusinessCalculatorTool slug="net-revenue-retention-calculator" /></ExpansionToolPage>;
}
