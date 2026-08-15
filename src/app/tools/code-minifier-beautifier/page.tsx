'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';


import { useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Code, Cpu, Terminal } from 'lucide-react';

export default function CodeMinifierBeautifierToolWrapper() {
  const meta = tools.find(t => t.slug === 'code-minifier-beautifier');
  return (
    <EnhancedToolWrapper meta={meta}>
      <CodeMinifierBeautifierToolWrapper />
    </EnhancedToolWrapper>
  );
}
