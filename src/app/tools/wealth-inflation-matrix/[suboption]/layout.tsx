import { notFound } from 'next/navigation';
import { createFinanceSuiteMetadata, getFinanceSuiteStaticParams, isFinanceSuiteSuboption } from '@/lib/seo/financeSuite';
export function generateStaticParams() { return getFinanceSuiteStaticParams('wealth-inflation-matrix'); }
export async function generateMetadata({ params }: { params: Promise<{ suboption: string }> }) { return createFinanceSuiteMetadata('wealth-inflation-matrix', (await params).suboption); }
export default async function Layout({ children, params }: LayoutProps<'/tools/wealth-inflation-matrix/[suboption]'>) {
  if (!isFinanceSuiteSuboption('wealth-inflation-matrix', (await params).suboption)) notFound();
  return children;
}
