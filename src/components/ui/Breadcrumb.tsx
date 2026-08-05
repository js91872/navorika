'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumb() {
  const pathname = usePathname();
  
  // Don't show breadcrumbs on homepage
  if (pathname === '/') return null;

  const segments = pathname.split('/').filter(Boolean);
  
  // Map segments to readable names
  const segmentNames: Record<string, string> = {
    'tools': 'Tools',
    'categories': 'Categories',
    'guides': 'Guides',
    'about': 'About',
    'privacy': 'Privacy Policy',
    'sitemap': 'Sitemap',
    'glossary': 'Glossary',
    'hubs': 'Hubs',
  };

  // Build breadcrumb items
  const items = [
    { name: 'Home', href: '/' },
    ...segments.map((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/');
      // Try to get display name from map, or format the segment
      let displayName = segmentNames[segment] || 
        segment.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      return { name: displayName, href };
    })
  ];

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-[var(--muted-foreground)] mb-4">
      <ol className="flex items-center flex-wrap gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-3 w-3 mx-1 text-[var(--muted-foreground)]" />
              )}
              {isLast ? (
                <span className="text-[var(--foreground)] font-medium">
                  {item.name}
                </span>
              ) : (
                <Link 
                  href={item.href} 
                  className="hover:text-[var(--foreground)] transition-colors hover:underline"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
