import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="RFC 3986 & WHATWG URL Decomposition"
      title="URL Parser"
      description="Parse a URL locally into protocol, hostname, port, pathname, query parameters and fragment."
      slug="url-parser"
    >
      <BusinessCalculatorTool slug="url-parser" />
    </ExpansionToolPage>
  );
}
