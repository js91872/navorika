import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import TargetCompressionTool from '@/components/tools/image/TargetCompressionTool';

export default function CompressImageTo20kbPage() {
  return (
    <ExpansionToolPage
      category="image-tools"
      eyebrow="Target Size Image Compression"
      title="Compress Image to 20KB"
      description="Compress JPG, PNG, and WebP images to 20KB or less locally for government forms, digital signatures, and strict portal file limits."
      slug="compress-image-to-20kb"
    >
      <TargetCompressionTool initialPreset="20kb" />
    </ExpansionToolPage>
  );
}
