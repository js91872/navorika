import { tools } from '@/data/registry';
import ImageConverterEngine from '@/components/ImageConverterEngine';
export const metadata = { title: 'SVG Vector to PNG Rasterizer | Navorika' };
export default function Page() { return <ImageConverterEngine meta={tools.find(t => t.slug === 'svg-to-png')!} />; }
