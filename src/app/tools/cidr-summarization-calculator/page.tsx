import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="Route Aggregation & Supernetting"
      title="CIDR Summarization Calculator"
      description="Summarize contiguous IPv4 CIDR networks into the smallest exact set of aggregate CIDR blocks."
      slug="cidr-summarization-calculator"
    >
      <BusinessCalculatorTool slug="cidr-summarization-calculator" />
    </ExpansionToolPage>
  );
}
