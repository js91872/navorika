import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="IANA Address Scope & Registry Lookup"
      title="IP Address Classifier"
      description="Classify an IPv4 or IPv6 address as private, public/global, loopback, link-local, multicast, documentation or another recognized special-use category."
      slug="ip-address-classifier"
    >
      <BusinessCalculatorTool slug="ip-address-classifier" />
    </ExpansionToolPage>
  );
}
