import ImageToPdfTool from '@/components/tools/ImageToPdfTool';

export default function Page() {
  return <ImageToPdfTool title="Image to PDF Converter" description="Convert one or more JPG, PNG or WebP images into a single PDF in your chosen order, with one image per page." accept="image/jpeg,image/png,image/webp" allowedTypes={['image/jpeg', 'image/png', 'image/webp']} />;
}
