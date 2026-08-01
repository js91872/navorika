import { tools } from '@/data/registry';
import ImageConverterEngine from '@/components/ImageConverterEngine';
export const metadata = { title: 'Convert iPhone HEIC to JPG | Navorika Mobile' };
export default function Page() { return <ImageConverterEngine meta={tools.find(t => t.slug === 'heic-to-jpg')!} />; }
