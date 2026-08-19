import { createReviewMetadata } from '@/lib/seo/toolReview';
import ToolPageContent from '@/components/seo/ToolPageContent'; import { imageToolPages } from '@/data/tool-pages/image'; const tool=imageToolPages['image-metadata-viewer'];
export const metadata = createReviewMetadata('Image Metadata Viewer');
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return <>{children}<ToolPageContent tool={tool}/></>; }
