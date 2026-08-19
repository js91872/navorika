import { createReviewMetadata } from '@/lib/seo/toolReview';
import ToolPageContent from '@/components/seo/ToolPageContent'; import { imageToolPages } from '@/data/tool-pages/image'; const tool=imageToolPages['compress-png'];
export const metadata = createReviewMetadata('Compress PNG');
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return <>{children}<ToolPageContent tool={tool}/></>; }
