import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="construction-calculators"
      eyebrow="Masonry Takeoffs & Mix Sizing"
      title="Mortar Calculator"
      description="Estimate mortar volume, pre-mix bags, Portland cement, and masonry sand for brick and concrete block walls."
      slug="mortar-calculator"
    >
      <BusinessCalculatorTool slug="mortar-calculator" />
    </ExpansionToolPage>
  );
}
