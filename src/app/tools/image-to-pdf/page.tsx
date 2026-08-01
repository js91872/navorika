import { tools } from '@/data/registry';
import ImageConverterEngine from '@/components/ImageConverterEngine';
export const metadata = { title: 'Image to PDF Converter | Navorika Sandbox' };
export default function Page() { return <ImageConverterEngine meta={tools.find(t => t.slug === 'image-to-pdf')!} />; }
