import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return <ExpansionToolPage category="finance-calculators" eyebrow="SaaS cash planning" title="SaaS Burn Rate Calculator" description="Distinguish gross expense burn, operating net burn, cash burn, and runway." slug="saas-burn-rate-calculator"><BusinessCalculatorTool slug="saas-burn-rate-calculator" /></ExpansionToolPage>;
}
