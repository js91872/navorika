import { createReviewMetadata } from '@/lib/seo/toolReview';
import ToolPageContent from '@/components/seo/ToolPageContent';
import { pdfToolPages } from '@/data/tool-pages/pdf';
const tool = pdfToolPages['add-image-to-pdf'];
export const metadata = createReviewMetadata('Add Image to PDF');
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return <>{children}<ToolPageContent tool={tool} /></>; }
