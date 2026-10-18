import { createToolMetadata } from '@/lib/seo/toolPage';
import ToolPageContent from '@/components/seo/ToolPageContent'; import { imageToolPages } from '@/data/tool-pages/image'; const tool=imageToolPages['svg-to-png'];
export const metadata = createToolMetadata(tool);
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return <>{children}<ToolPageContent tool={tool}/></>; }
