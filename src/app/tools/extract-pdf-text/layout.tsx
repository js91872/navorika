import ToolPageContent from '@/components/seo/ToolPageContent';
import { pdfToolPages } from '@/data/tool-pages/pdf';
import { createReviewMetadata } from '@/lib/seo/toolReview';
const tool = pdfToolPages['extract-pdf-text'];
export const metadata = createReviewMetadata('Extract PDF Text');
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return <>{children}<ToolPageContent tool={tool} /></>; }
