import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="image-tools"
      eyebrow="Proportional scaling & layout"
      title="Image Scaling Calculator"
      description="Calculate proportional dimensions, scale factor, and pixel area percentage when scaling images."
      slug="image-scaling-calculator"
    >
      <BusinessCalculatorTool slug="image-scaling-calculator" />
    </ExpansionToolPage>
  );
}
