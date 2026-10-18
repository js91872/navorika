import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="image-tools"
      eyebrow="Pixels Per Inch for Photo Printing"
      title="PPI Calculator"
      description="Calculate image PPI from pixel dimensions and print size, including horizontal, vertical and effective pixels per inch."
      slug="ppi-calculator"
    >
      <BusinessCalculatorTool slug="ppi-calculator" />
    </ExpansionToolPage>
  );
}
