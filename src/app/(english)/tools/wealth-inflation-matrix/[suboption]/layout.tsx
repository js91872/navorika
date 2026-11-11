import PageHelp from '@/components/seo/PageHelp';
import { notFound } from 'next/navigation';
import { createFinanceSuiteMetadata, getFinanceSuiteStaticParams, isFinanceSuiteSuboption } from '@/lib/seo/financeSuite';
export function generateStaticParams() { return getFinanceSuiteStaticParams('wealth-inflation-matrix'); }
export async function generateMetadata({ params }: { params: Promise<{ suboption: string }> }) { return createFinanceSuiteMetadata('wealth-inflation-matrix', (await params).suboption); }
export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ suboption: string }> }) {
  const { suboption } = await params;
  if (!isFinanceSuiteSuboption('wealth-inflation-matrix', suboption)) notFound();
  return <>{children}<PageHelp path={`/tools/wealth-inflation-matrix/${suboption}`} /></>;
}
