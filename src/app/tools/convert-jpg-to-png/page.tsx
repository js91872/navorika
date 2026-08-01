import { tools } from '@/data/registry';
import ImageConverterEngine from '@/components/ImageConverterEngine';
export const metadata = { title: 'Convert JPG to PNG Instantly | Navorika Sandbox' };
export default function Page() { return <ImageConverterEngine meta={tools.find(t => t.slug === 'convert-jpg-to-png')!} />; }
