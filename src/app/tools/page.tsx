'use client';

import Link from 'next/link';
import { tools } from '@/data/registry';

const getToolIcon = (slug: string): string => {
  const map: Record<string, string> = {
    'pdf': '📄', 'image': '🖼️', 'compress': '📦', 'resize': '📐',
    'crop': '✂️', 'rotate': '🔄', 'convert': '🔄', 'merge': '📑',
    'split': '✂️', 'protect': '🔒', 'unlock': '🔓', 'sign': '✍️',
    'watermark': '💧', 'bmi': '⚖️', 'bmr': '🔥', 'calorie': '🍎',
    'heart': '❤️', 'sip': '💰', 'emi': '🏦', 'tax': '📊',
    'gst': '🧾', 'ppf': '🏦', 'fd': '🏛️', 'json': '📋',
    'base64': '🔐', 'qr': '📱', 'jwt': '🔑', 'crypto': '🔒',
  };
  for (const [key, icon] of Object.entries(map)) {
    if (slug.includes(key)) return icon;
  }
  return '🔧';
};

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <h1 className="text-3xl font-bold mb-8">All Tools</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl hover:border-indigo-500 transition-all"
            >
              <div className="text-2xl">{getToolIcon(tool.slug)}</div>
              <h3 className="font-semibold mt-2">{tool.title}</h3>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">{tool.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
