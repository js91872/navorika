import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="Transport Layer & Firewall Port Sizing"
      title="TCP UDP Port Range Calculator"
      description="Calculate the inclusive number of TCP or UDP port numbers in a selected numeric range."
      slug="tcp-udp-port-range-calculator"
    >
      <BusinessCalculatorTool slug="tcp-udp-port-range-calculator" />
    </ExpansionToolPage>
  );
}
