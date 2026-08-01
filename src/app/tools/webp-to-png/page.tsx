import { tools } from '@/data/registry';
import ImageConverterEngine from '@/components/ImageConverterEngine';
export const metadata = { title: 'WEBP to PNG Lossless Converter | Navorika' };
export default function Page() { return <ImageConverterEngine meta={tools.find(t => t.slug === 'webp-to-png')!} />; }
