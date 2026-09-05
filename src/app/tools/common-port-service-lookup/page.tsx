import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="Standard Network Services & Ports"
      title="Common Port Service Lookup"
      description="Look up common TCP and UDP port numbers and their commonly associated services."
      slug="common-port-service-lookup"
    >
      <BusinessCalculatorTool slug="common-port-service-lookup" />
    </ExpansionToolPage>
  );
}
