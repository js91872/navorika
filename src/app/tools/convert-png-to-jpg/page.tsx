import { tools } from '@/data/registry';
import ImageConverterEngine from '@/components/ImageConverterEngine';
export const metadata = { title: 'Convert PNG to JPG Locally | Navorika Sandbox' };
export default function Page() { return <ImageConverterEngine meta={tools.find(t => t.slug === 'convert-png-to-jpg')!} />; }
