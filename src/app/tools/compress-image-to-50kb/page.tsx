import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import TargetCompressionTool from '@/components/tools/image/TargetCompressionTool';

export default function CompressImageTo50kbPage() {
  return (
    <ExpansionToolPage
      category="image-tools"
      eyebrow="Target Size Image Compression"
      title="Compress Image to 50KB"
      description="Compress passport photos, ID scans, and resume portraits to 50KB or less directly in your browser without uploading."
      slug="compress-image-to-50kb"
    >
      <TargetCompressionTool initialPreset="50kb" />
    </ExpansionToolPage>
  );
}
