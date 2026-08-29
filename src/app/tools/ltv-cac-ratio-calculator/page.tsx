import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return <ExpansionToolPage category="finance-calculators" eyebrow="SaaS unit economics" title="LTV CAC Ratio Calculator" description="Estimate customer lifetime value, LTV:CAC ratio, and payback period."><BusinessCalculatorTool slug="ltv-cac-ratio-calculator" /></ExpansionToolPage>;
}
