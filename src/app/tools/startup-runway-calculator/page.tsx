import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return <ExpansionToolPage category="finance-calculators" eyebrow="SaaS cash planning" title="Startup Runway Calculator" description="Estimate startup net burn and cash runway with optional growth scenarios." slug="startup-runway-calculator"><BusinessCalculatorTool slug="startup-runway-calculator" /></ExpansionToolPage>;
}
