import React from 'react';
import { Tool } from '@/types/tool';
import Container from '@/components/ui/Container';
import Breadcrumb from './Breadcrumb';

interface ToolLayoutProps {
  tool: Tool;
  children: React.ReactNode;
  showBreadcrumb?: boolean;
}

export default function ToolLayout({ 
  tool, 
  children, 
  showBreadcrumb = true 
}: ToolLayoutProps) {
  return (
    <Container>
      <div className="py-8 lg:py-12">
        {showBreadcrumb && <Breadcrumb tool={tool} />}
        
        {/* Tool Header */}
        <div className="mt-2 mb-6">
          <h1 className="text-3xl font-bold text-slate-900">{tool.title}</h1>
          <p className="text-slate-600 mt-1">{tool.shortDescription}</p>
        </div>
        
        {/* Tool Content */}
        {children}
      </div>
    </Container>
  );
}
