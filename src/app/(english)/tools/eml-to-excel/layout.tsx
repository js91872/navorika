import ToolPageContent from '@/components/seo/ToolPageContent';
import { emailToolPages } from '@/data/tool-pages/email';
import { createToolMetadata } from '@/lib/seo/toolPage';
const tool = emailToolPages['eml-to-excel'];
export const metadata = createToolMetadata(tool);
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return <>{children}<ToolPageContent tool={tool} /></>; }
