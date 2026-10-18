import { createToolMetadata } from '@/lib/seo/toolPage';
import ToolPageContent from '@/components/seo/ToolPageContent';
import { pdfToolPages } from '@/data/tool-pages/pdf';
const tool = pdfToolPages['pdf-to-image'];
export const metadata = createToolMetadata(tool);
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return <>{children}<ToolPageContent tool={tool} /></>; }
