import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import TargetCompressionTool from '@/components/tools/image/TargetCompressionTool';

export default function CompressPngTo100kbPage() {
  return (
    <ExpansionToolPage
      category="image-tools"
      eyebrow="Target Size Image Compression"
      title="Compress PNG to 100KB"
      description="Compress PNG files to 100KB or less through lossless re-encoding, dimensional downscaling, or optional WebP format conversion."
      slug="compress-png-to-100kb"
    >
      <TargetCompressionTool initialPreset="100kb" fixedFormat="image/png" initialPngMode="preserve-png" />
    </ExpansionToolPage>
  );
}
