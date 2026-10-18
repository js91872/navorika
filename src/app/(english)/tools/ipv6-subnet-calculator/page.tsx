import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="IPv6 Subnetting & Prefix Architecture"
      title="IPv6 Subnet Calculator"
      description="Calculate IPv6 subnet capacity, prefix relationships and subnet counts from IPv6 prefix lengths."
      slug="ipv6-subnet-calculator"
    >
      <BusinessCalculatorTool slug="ipv6-subnet-calculator" />
    </ExpansionToolPage>
  );
}
