'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumb() {
  const pathname = usePathname();
  
  if (!pathname || pathname === '/') return null;
  
  const segments = pathname.split('/').filter(Boolean);
  
  return (
    <nav className="flex items-center gap-1 text-sm text-[var(--muted-foreground)] py-2 overflow-x-auto">
      <Link href="/" className="hover:text-[var(--foreground)] transition-colors">
        Home
      </Link>
      {segments.map((segment, index) => {
        const href = '/' + segments.slice(0, index + 1).join('/');
        const isLast = index === segments.length - 1;
        const label = segment.replace(/-/g, ' ');
        
        return (
          <div key={href} className="flex items-center gap-1">
            <ChevronRight className="h-3 w-3" />
            {isLast ? (
              <span className="text-[var(--foreground)] font-medium capitalize">
                {label}
              </span>
            ) : (
              <Link href={href} className="hover:text-[var(--foreground)] transition-colors capitalize">
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
