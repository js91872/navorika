import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import TargetCompressionTool from '@/components/tools/image/TargetCompressionTool';

export default function CompressImageTo100kbPage() {
  return (
    <ExpansionToolPage
      category="image-tools"
      eyebrow="Target Size Image Compression"
      title="Compress Image to 100KB"
      description="Compress images to 100KB or less for online forms, document uploads, and fast mobile web publishing with binary quality search."
      slug="compress-image-to-100kb"
    >
      <TargetCompressionTool initialPreset="100kb" />
    </ExpansionToolPage>
  );
}
