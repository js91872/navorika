import PageHelp from '@/components/seo/PageHelp';
import { notFound } from 'next/navigation';
import { createFinanceSuiteMetadata, getFinanceSuiteStaticParams, isFinanceSuiteSuboption } from '@/lib/seo/financeSuite';
export function generateStaticParams() { return getFinanceSuiteStaticParams('savings-retirement-hub'); }
export async function generateMetadata({ params }: { params: Promise<{ suboption: string }> }) { return createFinanceSuiteMetadata('savings-retirement-hub', (await params).suboption); }
export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ suboption: string }> }) {
  const { suboption } = await params;
  if (!isFinanceSuiteSuboption('savings-retirement-hub', suboption)) notFound();
  return <>{children}<PageHelp path={`/tools/savings-retirement-hub/${suboption}`} /></>;
}
