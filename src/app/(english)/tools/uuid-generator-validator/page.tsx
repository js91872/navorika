import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="Cryptographic IDs & Validation"
      title="UUID Generator & Validator"
      description="Generate bulk cryptographically secure UUID v4 and timestamp-ordered UUID v7 identifiers, validate syntax, and inspect version and variant metadata."
      slug="uuid-generator-validator"
    >
      <BusinessCalculatorTool slug="uuid-generator-validator" />
    </ExpansionToolPage>
  );
}
