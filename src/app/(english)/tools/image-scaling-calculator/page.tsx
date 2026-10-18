import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="image-tools"
      eyebrow="Resize Image Dimensions by Percentage"
      title="Image Scaling Calculator"
      description="Calculate new proportional image width and height when scaling by percentage, plus the scale factor and pixel-area change."
      slug="image-scaling-calculator"
    >
      <BusinessCalculatorTool slug="image-scaling-calculator" />
    </ExpansionToolPage>
  );
}
