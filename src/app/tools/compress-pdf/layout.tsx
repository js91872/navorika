import { createReviewMetadata } from '@/lib/seo/toolReview';
import ToolPageContent from '@/components/seo/ToolPageContent';
import { pdfToolPages } from '@/data/tool-pages/pdf';
const tool = pdfToolPages['compress-pdf'];
export const metadata = createReviewMetadata('Compress PDF');
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return <>{children}<ToolPageContent tool={tool} /></>; }
