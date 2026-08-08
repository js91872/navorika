'use client';

import EnhancedToolWrapper from './EnhancedToolWrapper';

interface ToolSEOWrapperProps {
  meta?: any;
  children: React.ReactNode;
}

export default function ToolSEOWrapper({ meta, children }: ToolSEOWrapperProps) {
  return (
    <EnhancedToolWrapper meta={meta}>
      {children}
    </EnhancedToolWrapper>
  );
}
