import ImageToPdfTool from '@/components/tools/ImageToPdfTool';

export default function Page() {
  return <ImageToPdfTool title="JPG to PDF Converter" description="Convert one or more JPG or JPEG images into a single PDF in your chosen order, with one image per page." accept="image/jpeg,.jpg,.jpeg" allowedTypes={['image/jpeg']} />;
}
