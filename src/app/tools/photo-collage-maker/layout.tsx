import { createReviewMetadata } from '@/lib/seo/toolReview';
import ToolPageContent from '@/components/seo/ToolPageContent'; import { imageToolPages } from '@/data/tool-pages/image'; const tool=imageToolPages['photo-collage-maker'];
export const metadata = createReviewMetadata('Photo Collage Maker');
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return <>{children}<ToolPageContent tool={tool}/></>; }
