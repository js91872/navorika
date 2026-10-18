import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="image-tools"
      eyebrow="Calculate Raw Image Size"
      title="Image File Size Calculator"
      description="Calculate the uncompressed size of an image from pixel width, height, color channels and bit depth."
      slug="image-file-size-estimator"
    >
      <BusinessCalculatorTool slug="image-file-size-estimator" />
    </ExpansionToolPage>
  );
}
