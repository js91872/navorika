import { tools } from '@/data/registry';
import ImageConverterEngine from '@/components/ImageConverterEngine';
export const metadata = { title: 'Convert WEBP to PDF Document | Navorika' };
export default function Page() { return <ImageConverterEngine meta={tools.find(t => t.slug === 'webp-to-pdf')!} />; }
