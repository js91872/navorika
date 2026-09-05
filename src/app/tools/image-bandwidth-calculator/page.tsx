import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="image-tools"
      eyebrow="Network payload & bandwidth planning"
      title="Image Bandwidth Calculator"
      description="Estimate monthly data transfer volume from image size, page views, and image counts."
      slug="image-bandwidth-calculator"
    >
      <BusinessCalculatorTool slug="image-bandwidth-calculator" />
    </ExpansionToolPage>
  );
}
