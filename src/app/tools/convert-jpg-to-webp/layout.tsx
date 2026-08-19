import { createReviewMetadata } from '@/lib/seo/toolReview';
import ToolPageContent from '@/components/seo/ToolPageContent'; import { imageToolPages } from '@/data/tool-pages/image';
const tool = imageToolPages['convert-jpg-to-webp'];
export const metadata = createReviewMetadata('JPG to WebP');
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return <>{children}<ToolPageContent tool={tool} /></>; }
