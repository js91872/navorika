import { createToolMetadata } from '@/lib/seo/toolPage';
import ToolPageContent from '@/components/seo/ToolPageContent'; import { developerToolPages } from '@/data/tool-pages/developer'; const tool=developerToolPages['web-crypto-studio'];
export const metadata = createToolMetadata(tool);
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return <>{children}<ToolPageContent tool={tool}/></>; }
