import { createReviewMetadata } from '@/lib/seo/toolReview';
import ToolPageContent from '@/components/seo/ToolPageContent';
import { pdfToolPages } from '@/data/tool-pages/pdf';
const tool = pdfToolPages['pdf-to-jpg'];
export const metadata = createReviewMetadata('PDF to JPG');
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return <>{children}<ToolPageContent tool={tool} /></>; }
