import { createReviewMetadata } from '@/lib/seo/toolReview';
import ToolPageContent from '@/components/seo/ToolPageContent'; import { developerToolPages } from '@/data/tool-pages/developer'; const tool=developerToolPages['web-crypto-studio'];
export const metadata = createReviewMetadata('Web Crypto Studio');
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return <>{children}<ToolPageContent tool={tool}/></>; }
