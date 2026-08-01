import { tools } from '@/data/registry';
import ImageConverterEngine from '@/components/ImageConverterEngine';
export const metadata = { title: 'Convert Apple HEIC to PNG Lossless | Navorika' };
export default function Page() { return <ImageConverterEngine meta={tools.find(t => t.slug === 'heic-to-png')!} />; }
