import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return <ExpansionToolPage category="developer-tools" eyebrow="Delivery cost planning" title="CDN Cost Calculator" description="Estimate CDN delivery, request, cache-miss origin traffic, and origin egress costs."><BusinessCalculatorTool slug="cdn-cost-calculator" /></ExpansionToolPage>;
}
