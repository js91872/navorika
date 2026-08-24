import type { Metadata } from 'next';
import { categories } from '@/data/registry';

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return params.then(({ slug }) => {
    const category = categories.find((item) => item.slug === slug);
    if (!category) return { title: 'Category Not Found', robots: { index: false, follow: false } };
    const url = `https://navorika.com/categories/${slug}`;
    return { title: category.name, description: category.description, alternates: { canonical: url }, openGraph: { type: 'website', url, title: category.name, description: category.description, siteName: 'Navorika' } };
  });
}

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
