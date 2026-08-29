import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return <ExpansionToolPage category="finance-calculators" eyebrow="SaaS unit economics" title="CAC Payback Calculator" description="Estimate how long customer gross profit takes to recover acquisition cost."><BusinessCalculatorTool slug="cac-payback-calculator" /></ExpansionToolPage>;
}
