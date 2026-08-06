'use client';

import { usePathname } from 'next/navigation';
import { tools } from '@/data/registry';
import ToolAISearch from '@/components/seo/ToolAISearch';

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const slug = pathname?.split('/').pop() || '';
  
  // Don't wrap the main tools page
  if (pathname === '/tools' || !slug) {
    return <>{children}</>;
  }

  const tool = tools.find(t => t.slug === slug);
  
  if (!tool) {
    return <>{children}</>;
  }

  return (
    <>
      <ToolAISearch tool={tool} />
      {children}
    </>
  );
}
