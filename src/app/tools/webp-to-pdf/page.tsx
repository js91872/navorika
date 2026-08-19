import ImageToPdfTool from '@/components/tools/ImageToPdfTool';

export default function Page() {
  return <ImageToPdfTool title="WebP to PDF" description="Convert one or more WebP images into an ordered PDF locally in your browser." accept="image/webp,.webp" />;
}
