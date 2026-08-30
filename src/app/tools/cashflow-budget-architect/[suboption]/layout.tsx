import { notFound } from 'next/navigation';
import { createFinanceSuiteMetadata, getFinanceSuiteStaticParams, isFinanceSuiteSuboption } from '@/lib/seo/financeSuite';
export function generateStaticParams() { return getFinanceSuiteStaticParams('cashflow-budget-architect'); }
export async function generateMetadata({ params }: { params: Promise<{ suboption: string }> }) { return createFinanceSuiteMetadata('cashflow-budget-architect', (await params).suboption); }
export default async function Layout({ children, params }: LayoutProps<'/tools/cashflow-budget-architect/[suboption]'>) {
  if (!isFinanceSuiteSuboption('cashflow-budget-architect', (await params).suboption)) notFound();
  return children;
}
