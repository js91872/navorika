import PageHelp from '@/components/seo/PageHelp';
import { notFound } from 'next/navigation';
import { createFinanceSuiteMetadata, getFinanceSuiteStaticParams, isFinanceSuiteSuboption } from '@/lib/seo/financeSuite';
export function generateStaticParams() { return getFinanceSuiteStaticParams('investment-return-profiler'); }
export async function generateMetadata({ params }: { params: Promise<{ suboption: string }> }) { return createFinanceSuiteMetadata('investment-return-profiler', (await params).suboption); }
export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ suboption: string }> }) {
  const { suboption } = await params;
  if (!isFinanceSuiteSuboption('investment-return-profiler', suboption)) notFound();
  return <>{children}<PageHelp path={`/tools/investment-return-profiler/${suboption}`} /></>;
}
