import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import TargetCompressionTool from '@/components/tools/image/TargetCompressionTool';

export default function CompressImageTo200kbPage() {
  return (
    <ExpansionToolPage
      category="image-tools"
      eyebrow="Target Size Image Compression"
      title="Compress Image to 200KB"
      description="Compress high-resolution photos and banners to 200KB or less while preserving clarity, color balance, and aspect ratio."
      slug="compress-image-to-200kb"
    >
      <TargetCompressionTool initialPreset="200kb" />
    </ExpansionToolPage>
  );
}
