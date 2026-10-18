import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="construction-calculators"
      eyebrow="Calculate Soffit & Fascia Material Quantity"
      title="Soffit & Fascia Calculator"
      description="Calculate soffit area, fascia board length, panel count, board quantity and waste from your roof-eave measurements."
      slug="soffit-fascia-calculator"
    >
      <BusinessCalculatorTool slug="soffit-fascia-calculator" />
    </ExpansionToolPage>
  );
}
