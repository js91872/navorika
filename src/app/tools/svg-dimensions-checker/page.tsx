import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import SvgDimensionsTool from '@/components/tools/SvgDimensionsTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="image-tools"
      eyebrow="Vector Dimensions & ViewBox"
      title="SVG Dimensions Checker"
      description="Inspect width, height, declared CSS units, viewBox coordinate system, and aspect ratio of SVG vector graphics without rasterization or script execution."
      slug="svg-dimensions-checker"
    >
      <SvgDimensionsTool />
    </ExpansionToolPage>
  );
}
