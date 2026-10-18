import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import TargetCompressionTool from '@/components/tools/image/TargetCompressionTool';

export default function CompressJpgTo100kbPage() {
  return (
    <ExpansionToolPage
      category="image-tools"
      eyebrow="Target Size Image Compression"
      title="Compress JPG to 100KB"
      description="Compress JPEG photos to 100KB or less with optimal visual quality, custom dimensional scaling, and browser-local processing."
      slug="compress-jpg-to-100kb"
    >
      <TargetCompressionTool initialPreset="100kb" fixedFormat="image/jpeg" />
    </ExpansionToolPage>
  );
}
