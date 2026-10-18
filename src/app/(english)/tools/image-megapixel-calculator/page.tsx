import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="image-tools"
      eyebrow="Pixels to Megapixels Calculator"
      title="Megapixel Calculator"
      description="Calculate megapixels from image width and height in pixels, plus total pixel count and simplified aspect ratio."
      slug="image-megapixel-calculator"
    >
      <BusinessCalculatorTool slug="image-megapixel-calculator" />
    </ExpansionToolPage>
  );
}
