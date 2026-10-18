import ToolPageContent from '@/components/seo/ToolPageContent';
import { pdfToolPages } from '@/data/tool-pages/pdf';
import { createToolMetadata } from '@/lib/seo/toolPage';
const tool = pdfToolPages['interleave-pdf'];
export const metadata = createToolMetadata(tool);
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return <>{children}<ToolPageContent tool={tool} /></>; }
