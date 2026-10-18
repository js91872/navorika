import ToolPageContent from '@/components/seo/ToolPageContent'; import { healthToolPages } from '@/data/tool-pages/health'; import { createToolMetadata } from '@/lib/seo/toolPage';
const tool = healthToolPages['walking-calories-calculator']; export const metadata = createToolMetadata(tool);
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return <>{children}<ToolPageContent tool={tool} /></>; }
