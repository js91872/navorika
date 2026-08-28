import ImageToPdfTool from '@/components/tools/ImageToPdfTool';

export default function Page() {
  return <ImageToPdfTool title="Image to PDF" description="Combine JPG, PNG, and WebP images into one PDF in your chosen order." accept="image/jpeg,image/png,image/webp" allowedTypes={['image/jpeg', 'image/png', 'image/webp']} />;
}
