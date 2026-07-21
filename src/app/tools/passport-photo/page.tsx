import ToolLayout from "@/components/tool/ToolLayout";
import PassportPhoto from "@/components/calculator/image/PassportPhoto";
import { getToolBySlug } from "@/lib/toolRegistry";

export default function PassportPhotoPage() {
  const tool = getToolBySlug("passport-photo");

  if (!tool) {
    return <div>Tool not found.</div>;
  }

  return (
    <ToolLayout tool={tool}>
      <PassportPhoto />
    </ToolLayout>
  );
}
