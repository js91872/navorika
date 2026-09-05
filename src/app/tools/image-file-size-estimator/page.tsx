import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="image-tools"
      eyebrow="Uncompressed memory footprint"
      title="Image File Size Estimator"
      description="Estimate raw uncompressed image memory size from dimensions, channels, and bit depth."
      slug="image-file-size-estimator"
    >
      <BusinessCalculatorTool slug="image-file-size-estimator" />
    </ExpansionToolPage>
  );
}
