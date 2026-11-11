import PageHelp from '@/components/seo/PageHelp';
import { notFound } from 'next/navigation';
import { createFinanceSuiteMetadata, getFinanceSuiteStaticParams, isFinanceSuiteSuboption } from '@/lib/seo/financeSuite';
export function generateStaticParams() { return getFinanceSuiteStaticParams('cashflow-budget-architect'); }
export async function generateMetadata({ params }: { params: Promise<{ suboption: string }> }) { return createFinanceSuiteMetadata('cashflow-budget-architect', (await params).suboption); }
export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ suboption: string }> }) {
  const { suboption } = await params;
  if (!isFinanceSuiteSuboption('cashflow-budget-architect', suboption)) notFound();
  return <>{children}<PageHelp path={`/tools/cashflow-budget-architect/${suboption}`} /></>;
}
