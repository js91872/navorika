import { notFound } from 'next/navigation';
import { createFinanceSuiteMetadata, getFinanceSuiteStaticParams, isFinanceSuiteSuboption } from '@/lib/seo/financeSuite';
export function generateStaticParams() { return getFinanceSuiteStaticParams('investment-return-profiler'); }
export async function generateMetadata({ params }: { params: Promise<{ suboption: string }> }) { return createFinanceSuiteMetadata('investment-return-profiler', (await params).suboption); }
export default async function Layout({ children, params }: LayoutProps<'/tools/investment-return-profiler/[suboption]'>) {
  if (!isFinanceSuiteSuboption('investment-return-profiler', (await params).suboption)) notFound();
  return children;
}
