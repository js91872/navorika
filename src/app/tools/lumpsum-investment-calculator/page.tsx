import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="finance-calculators"
      eyebrow="Portfolio & Capital Growth"
      title="Lumpsum Investment Calculator"
      description="Calculate future maturity value, total compound wealth gained, real purchasing power, and wealth multiple for a one-time lump-sum investment."
      slug="lumpsum-investment-calculator"
    >
      <BusinessCalculatorTool slug="lumpsum-investment-calculator" />
    </ExpansionToolPage>
  );
}
