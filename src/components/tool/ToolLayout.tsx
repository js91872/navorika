import React from 'react';
import { Tool } from '@/types/tool';
import Container from '@/components/ui/Container';
import Breadcrumb from './Breadcrumb';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { PremiumHeading } from '@/components/ui/PremiumHeading';
import { PremiumBadge } from '@/components/ui/PremiumBadge';
import { Bookmark, Share2, Sparkles } from 'lucide-react';

interface ToolLayoutProps {
  tool: Tool;
  children: React.ReactNode;
}

export default function ToolLayout({ tool, children }: ToolLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <Container>
        <div className="py-8 lg:py-12">
          <Breadcrumb tool={tool} />
          
          {/* Tool Header */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{tool.icon || '🔧'}</span>
                  <PremiumHeading level="h2">{tool.title}</PremiumHeading>
                </div>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
                  {tool.shortDescription}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="rounded-xl border border-slate-200/80 p-2.5 text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">
                  <Bookmark className="h-5 w-5" />
                </button>
                <button className="rounded-xl border border-slate-200/80 p-2.5 text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {tool.badge && (
              <PremiumBadge variant="blue" icon={<Sparkles className="h-3.5 w-3.5" />}>
                {tool.badge}
              </PremiumBadge>
            )}
          </div>
          
          {/* Tool Content */}
          <PremiumCard glass hover={false} padding="none" className="overflow-hidden">
            {children}
          </PremiumCard>
        </div>
      </Container>
    </div>
  );
}
