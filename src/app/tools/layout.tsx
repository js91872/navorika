'use client';

import { usePathname } from 'next/navigation';
import ToolSEOWrapper from '@/components/ToolSEOWrapper';

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const slug = pathname?.split('/').pop() || '';

  // Don't wrap the main tools page
  if (pathname === '/tools' || !slug) {
    return <>{children}</>;
  }

  return (
    <ToolSEOWrapper slug={slug}>
      {children}
    </ToolSEOWrapper>
  );
}
