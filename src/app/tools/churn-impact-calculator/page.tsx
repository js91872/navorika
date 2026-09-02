import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return <ExpansionToolPage category="finance-calculators" eyebrow="SaaS retention planning" title="Churn Impact Calculator" description="Project gross customer losses, revenue impact, ending customers, and MRR." slug="churn-impact-calculator"><BusinessCalculatorTool slug="churn-impact-calculator" /></ExpansionToolPage>;
}
