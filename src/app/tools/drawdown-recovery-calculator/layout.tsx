import ToolPageContent from '@/components/seo/ToolPageContent';
import { businessToolPages } from '@/data/tool-pages/business';
import { createToolMetadata } from '@/lib/seo/toolPage';

const tool = businessToolPages['drawdown-recovery-calculator'];
export const metadata = createToolMetadata(tool);
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return <>{children}<ToolPageContent tool={tool} /></>; }
