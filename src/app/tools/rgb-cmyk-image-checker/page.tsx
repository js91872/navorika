import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import RgbCmykImageTool from '@/components/tools/RgbCmykImageTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="image-tools"
      eyebrow="Color Space & Header Preflight"
      title="RGB CMYK Image Checker"
      description="Inspect raw image file container headers to detect color space (RGB, CMYK, Grayscale, Indexed), channel depth, and embedded ICC profiles without browser color conversion."
      slug="rgb-cmyk-image-checker"
    >
      <RgbCmykImageTool />
    </ExpansionToolPage>
  );
}
