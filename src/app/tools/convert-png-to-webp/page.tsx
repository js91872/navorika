import { tools } from '@/data/registry';
import ImageConverterEngine from '@/components/ImageConverterEngine';
export const metadata = { title: 'Convert PNG to WEBP Optimized | Navorika' };
export default function Page() { return <ImageConverterEngine meta={tools.find(t => t.slug === 'convert-png-to-webp')!} />; }
