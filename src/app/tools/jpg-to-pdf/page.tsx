import ImageToPdfTool from '@/components/tools/ImageToPdfTool';

export default function Page() {
  return <ImageToPdfTool title="JPG to PDF" description="Turn one or more JPG images into a single PDF without uploading them." accept="image/jpeg,.jpg,.jpeg" allowedTypes={['image/jpeg']} />;
}
