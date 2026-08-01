import { tools } from '@/data/registry';
import ImageConverterEngine from '@/components/ImageConverterEngine';
export const metadata = { title: 'PNG Pixels to SVG Vectorizer | Navorika' };
export default function Page() { return <ImageConverterEngine meta={tools.find(t => t.slug === 'png-to-svg')!} />; }
