import { tools } from '@/data/registry';
import ImageConverterEngine from '@/components/ImageConverterEngine';
export const metadata = { title: 'Convert WEBP to JPG Free | Navorika Sandbox' };
export default function Page() { return <ImageConverterEngine meta={tools.find(t => t.slug === 'convert-webp-to-jpg')!} />; }
