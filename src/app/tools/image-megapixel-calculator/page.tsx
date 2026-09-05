import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="image-tools"
      eyebrow="Image resolution & sensor specs"
      title="Image Megapixel Calculator"
      description="Calculate megapixels, total pixel count, and simplified aspect ratio from image dimensions."
      slug="image-megapixel-calculator"
    >
      <BusinessCalculatorTool slug="image-megapixel-calculator" />
    </ExpansionToolPage>
  );
}
