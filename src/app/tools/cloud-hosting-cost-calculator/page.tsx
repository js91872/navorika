import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return <ExpansionToolPage category="developer-tools" eyebrow="Cloud cost planning" title="Cloud Hosting Cost Calculator" description="Estimate compute, storage, bandwidth, and additional cloud service costs." slug="cloud-hosting-cost-calculator"><BusinessCalculatorTool slug="cloud-hosting-cost-calculator" /></ExpansionToolPage>;
}
