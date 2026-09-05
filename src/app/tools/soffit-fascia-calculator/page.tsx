import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="construction-calculators"
      eyebrow="Roof eave & trim estimating"
      title="Soffit & Fascia Calculator"
      description="Estimate soffit area, fascia length, material pieces, and waste allowance for roof eaves."
      slug="soffit-fascia-calculator"
    >
      <BusinessCalculatorTool slug="soffit-fascia-calculator" />
    </ExpansionToolPage>
  );
}
