import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return <ExpansionToolPage category="developer-tools" eyebrow="Compute cost planning" title="GPU Compute Cost Calculator" description="Estimate GPU-hours and compute costs per run, day, month, and year." slug="gpu-compute-cost-calculator"><BusinessCalculatorTool slug="gpu-compute-cost-calculator" /></ExpansionToolPage>;
}
