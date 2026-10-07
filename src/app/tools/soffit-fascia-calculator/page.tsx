import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="construction-calculators"
      eyebrow="Soffit & Fascia Materials"
      title="Soffit & Fascia Calculator"
      description="Calculate how much soffit and fascia material you need from your eave measurements, panel or board size, and waste allowance."
      slug="soffit-fascia-calculator"
    >
      <BusinessCalculatorTool slug="soffit-fascia-calculator" />
    </ExpansionToolPage>
  );
}
